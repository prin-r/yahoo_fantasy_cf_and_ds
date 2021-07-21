use obi::{OBIDecode, OBIEncode, OBISchema};
use owasm2::{execute_entry_point, ext, oei, prepare_entry_point};

const YAHOO_FANTASYSPORTS_DS: i64 = 87;

#[derive(OBIDecode, OBISchema)]
struct Input {
  path: String,
  keys: String,
}

#[derive(OBIEncode, OBISchema)]
struct Output {
  value: String,
}

#[no_mangle]
fn prepare_impl(input: Input) {
  oei::ask_external_data(
    1,
    YAHOO_FANTASYSPORTS_DS,
    format!("{} {}", input.path, input.keys).as_bytes(),
  )
}

#[no_mangle]
fn execute_impl(_: Input) -> Output {
  Output {
    value: ext::load_majority(1).unwrap(),
  }
}

prepare_entry_point!(prepare_impl);
execute_entry_point!(execute_impl);

#[cfg(test)]
mod tests {
  use super::*;
  use obi::get_schema;
  use std::collections::*;

  #[test]
  fn test_get_schema() {
    let mut schema = HashMap::new();
    Input::add_definitions_recursively(&mut schema);
    Output::add_definitions_recursively(&mut schema);
    let input_schema = get_schema(String::from("Input"), &schema);
    let output_schema = get_schema(String::from("Output"), &schema);
    println!("{}/{}", input_schema, output_schema);
    // assert_eq!(
    //   "{path:string,keys:string}/{value:string}",
    //   format!("{}/{}", input_schema, output_schema),
    // );
  }
}
