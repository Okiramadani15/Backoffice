module.exports = {
 
 apps: [
 
 {
 
 name: "backoffice-alhasyimiyah", // ubah sesuai nama aplikasi yang dibuat
 
            script: "npx",
 
 // sesuaikan port yang telah diubah
 
            args: "serve -s -l 3000 build",
 
 interpreter: "none",
 
 watch: true,
 
 merge_logs: true,
 
 env: {
 
 "NODE_ENV": "production", 
 
 }
 
 }
 
 ]
 
}
