#[macro_use]
extern crate rocket;
use rocket::serde::json::Json;
use rocket::serde::Serialize;
use sqlite;

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
struct Tag {
    id: u32,
    tag_name: String,
}

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
struct TagList {
    tags: Vec<Tag>,
}

#[get("/posts/<post_id>/tags")]
fn post_tags(post_id: u32) -> Json<TagList> {
    let connection = sqlite::open("/db.sqlite3").unwrap();
    let query = "select tags.tag_name as tag_name, tags.id as id from post_tags join tags on post_tags.tag_id = tags.id where post_tags.post_id = ?;";
    let mut tags: Vec<Tag> = vec![];
    // TODO optimize
    for row in connection
        .prepare(query)
        .unwrap()
        .into_iter()
        .bind((1, post_id as i64))
        .unwrap()
        .map(|row| row.unwrap())
    {
        tags.push(Tag {
            id: row.read::<i64, _>("id") as u32,
            tag_name: row.read::<&str, _>("tag_name").to_string(),
        });
    }
    Json(TagList { tags: tags })
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![post_tags])
}
