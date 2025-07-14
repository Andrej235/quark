use proc_macro::TokenStream;
use quote::quote;
use syn::spanned::Spanned;
use syn::{Attribute, Data, DeriveInput, Fields, Lit, parse_macro_input};

#[proc_macro_derive(GenerateFieldEnum, attributes(enum_name))]
pub fn generate_field_enum(input: TokenStream) -> TokenStream {
    let input: DeriveInput = parse_macro_input!(input as DeriveInput);

    let struct_name: &syn::Ident = &input.ident;
    let enum_name: syn::Ident =
        syn::Ident::new(&format!("{}Field", struct_name), struct_name.span());

    let mut variants: Vec<proc_macro2::TokenStream> = Vec::new();
    let mut matches: Vec<proc_macro2::TokenStream> = Vec::new();

    if let Data::Struct(data_struct) = input.data {
        if let Fields::Named(fields_named) = data_struct.fields {
            for field in fields_named.named {
                for attr in &field.attrs {
                    if attr.path().is_ident("enum_name") {
                        let field_name = field.ident.as_ref().unwrap();
                        let field_name_str = field_name.to_string();

                        let variant_name = parse_enum_name_attribute(attr);
                        let variant_ident = syn::Ident::new(&variant_name, attr.span());

                        variants.push(quote! { #variant_ident });
                        matches.push(quote! {
                            #enum_name::#variant_ident => #field_name_str,
                        });
                    }
                }
            }
        }
    }

    let expanded = quote! {
    #[derive(Debug, Clone, Copy, PartialEq, Eq)]
        pub enum #enum_name {
            #(#variants),*
        }

        impl #enum_name {
            pub fn get_name(&self) -> &'static str {
                match self {
                    #(#matches)*
                }
            }
        }

        impl crate::traits::field_name::FieldName for #enum_name {
            fn get_name(&self) -> &'static str {
                self.get_name()
            }
        }
    };

    TokenStream::from(expanded)
}

/// Helper to parse #[enum_name("Variant")]
fn parse_enum_name_attribute(attr: &Attribute) -> String {
    attr.parse_args::<Lit>()
        .expect("Expected #[enum_name(\"Variant\")] with a string literal")
        .into_str()
}

/// Extension method to extract string from Lit
trait IntoStr {
    fn into_str(self) -> String;
}

impl IntoStr for Lit {
    fn into_str(self) -> String {
        match self {
            Lit::Str(s) => s.value(),
            _ => panic!("Expected string literal"),
        }
    }
}
