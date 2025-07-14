pub trait FieldName {
    fn get_name(&self) -> &'static str;
}
