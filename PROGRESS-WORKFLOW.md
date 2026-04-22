# How to update your card progress

Your collection state lives in **JSON files in the repo** (`progress/ogerpon.json`, `progress/wishlist.json`). GitHub Pages only serves those files; it cannot save changes from the browser.

To **edit** progress on your computer and then **publish** it on GitHub, follow the steps below.

---

## One-time setup

1. Install **[Node.js](https://nodejs.org/)** (the LTS version is fine) if you do not already have it. That installs `node` and `npm`.
2. You do **not** need to run `npm install` in this project for the local server (there are no extra dependencies).

---

## Updating progress (save to files you can commit)

1. Open a terminal in this project folder, for example:

   ```text
   c:\Users\Viki\Desktop\stuff\pokemon
   ```

2. Start the local server:

   ```text
   npm run local
   ```

3. Leave that terminal window open while you work. You should see a line with the URL, for example:

   ```text
   http://127.0.0.1:8765/
   ```

4. In your browser, open **exactly** that address (not GitHub Pages, not a `file:///...` link):

   ```text
   http://127.0.0.1:8765/
   ```

5. If the lock screen appears, enter your password.
6. Open **Ogerpon** or **Wishlist** and click the status button on each card (cycles: not yet → on the way → owned → not yet).

   Each change is written to disk in:

   - `progress/ogerpon.json`
   - `progress/wishlist.json`

7. When you are finished, you can stop the server with **Ctrl+C** in the terminal (optional).

---

## Publishing changes to GitHub (and GitHub Pages)

1. Stage the progress files (and any other files you changed):

   ```text
   git add progress/ogerpon.json progress/wishlist.json
   ```

2. Commit:

   ```text
   git commit -m "Update card progress"
   ```

3. Push to GitHub as you usually do.

After the push, your GitHub Pages site will show whatever is in those committed JSON files.

---

## Viewing only (other devices, GitHub Pages)

- Open your **GitHub Pages** URL (or any device with a normal link to the site).
- You see the **last pushed** progress from `progress/*.json`.
- You can still click cards for a **temporary preview in that tab**; that does **not** change the repo or your files. Refreshing reloads the published data.

---

## Quick reference

| Goal | What to do |
| ------ | ------------ |
| Save progress to files | `npm run local` → open `http://127.0.0.1:8765/` → click cards |
| Update the live site | Commit and push `progress/*.json` |
| Just look | Open GitHub Pages; no server needed |

---

## If something goes wrong

- **Clicks do not create/update JSON**  
  You are probably not on `http://127.0.0.1:8765/` (or `http://localhost:8765/`). The local server must be running, and you must use that URL—not a double-clicked `index.html` file. Browsers cannot write those JSON files from `file://`.

- **“Could not write the file”**  
  Make sure `npm run local` is still running and you are on the correct port (default **8765**).

- **Add a new list later**  
  Add a new `progress/<id>.json`, extend `lists-meta.json`, and wire the checklist page the same way as Ogerpon or Wishlist.
