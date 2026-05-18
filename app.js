// This is a wrapper for CPanel Node.js Selector which often expects app.js or index.js in the root
// It imports the bundled production server from the dist folder
import('./dist/server.cjs').catch(err => {
    console.error('Failed to load server.cjs:', err);
    process.exit(1);
});
