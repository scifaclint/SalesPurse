ipcMain.handle("login", async (_, credentials) => {
  try {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT id, name, username, type, phone 
         FROM users 
         WHERE username = ? AND password = ?`,
        [credentials.username, credentials.password],
        (err, user) => {
          if (err) {
            reject(err);
          } else if (!user) {
            resolve({ success: false });
          } else {
            resolve({
              success: true,
              user: {
                id: user.id,
                name: user.name,
                username: user.username,
                type: user.type,
                phone: user.phone
              }
            });
          }
        }
      );
    });
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}); 