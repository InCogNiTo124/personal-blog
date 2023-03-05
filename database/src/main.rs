#[macro_use] extern crate rocket;
use rocket::serde::Serialize;
use rocket::serde::json::Json;
use sqlite;

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
struct TagList {
    tags: Vec<String>
}

#[get("/posts/<post_id>/tags")]
fn post_tags(post_id: u32) -> Json<TagList> {
    let connection = sqlite::open("../db.sqlite3").unwrap();
    let query = "SELECT tag_name FROM tags;";
    let mut tags: Vec<String> = vec![];
    // TODO optimize
    connection.iterate(query, |pairs| {
        for &(name, value) in pairs.iter() {
            match (name) {
                "tag_name" => tags.push(String::from(value.unwrap())),
                _ => {}
            }
        }
        true
    }).unwrap();
    Json(TagList { tags: tags})
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![post_tags])
}
