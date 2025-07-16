use rand::rngs::OsRng;
use rand::RngCore;
use std::fs::{self, File};
use std::io::Write;
use tauri::Manager;
use tauri_plugin_stronghold::Builder as StrongholdBuilder;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let app_data_dir = app
                .path()
                .app_local_data_dir()
                .expect("could not resolve app local data path");
            let salt_path = app_data_dir.join("salt.txt");

            if !app_data_dir.exists() {
                fs::create_dir_all(&app_data_dir).expect("failed to create app data directory");
            }

            if !salt_path.exists() {
                let mut salt = [0u8; 16];
                OsRng.fill_bytes(&mut salt);
                let mut file = File::create(&salt_path).expect("failed to create salt.txt");
                file.write_all(&salt)
                    .expect("failed to write salt to salt.txt");
            }

            app.handle()
                .plugin(StrongholdBuilder::with_argon2(&salt_path).build())?;

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
