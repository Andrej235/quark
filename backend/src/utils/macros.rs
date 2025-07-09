/*#[macro_export]
macro_rules! current_function {
    () => {{
        fn f() {}
        let name = std::any::type_name_of_val(&f);
        name.strip_suffix("::f").unwrap_or(name)
    }};
}*/