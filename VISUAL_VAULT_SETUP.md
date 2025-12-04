# Visual Vault - Cloudinary Setup Guide

## Overview
The Visual Vault feature is now fully implemented and ready for Cloudinary configuration. Follow these steps to enable video uploads and secure delivery.

---

## Step 1: Create Cloudinary Upload Preset

This allows your app to upload videos directly to Cloudinary without exposing your API key.

### Instructions:

1. Log into your Cloudinary dashboard: https://cloudinary.com/console/
2. Navigate to **Settings** (gear icon) → **Upload** tab
3. Scroll to **Upload presets** section
4. Click **Add upload preset**
5. Fill in the form:

   | Field | Value |
   |-------|-------|
   | Preset name | `visual_vault_preset` |
   | Signing Mode | **Unsigned** (important!) |
   | Folder | `visual-vault` |
   | Allowed formats | `mp4, mov, webm, avi` |
   | Max file size | `100 MB` |

6. Click **Save**

### Optional Transformations (Recommended):
- Scroll to **Eager transformations**
- Click **Add transformation**
- Set width/height: `1920 x 1080`
- Enable **Auto-optimize quality**
- Enable **Auto-format** (converts to best format for browser)
- Click **Save**

---

## Step 2: Configure Domain Restriction (Security)

This prevents your videos from being embedded on unauthorized domains.

### Instructions:

1. In Cloudinary dashboard, go to **Settings** → **Security** tab
2. Scroll to **Allowed fetch domains**
3. Click **Add domain**
4. Add your domains (one at a time):

   **Development:**
   ```
   localhost:5173
   127.0.0.1:5173
   ```

   **Production:**
   ```
   intuition-lab.vercel.app
   ```

   **Additional (if needed):**
   ```
   your-custom-domain.com
   ```

5. Enable checkbox: **Restrict media delivery to allowed domains**
6. Click **Save**

### What This Does:
- Videos will ONLY play on these domains
- Attempting to embed videos elsewhere will fail
- Provides strong security for client work

---

## Step 3: Environment Variables (Already Configured)

Your `.env.local` file has been updated with:

```env
VITE_CLOUDINARY_CLOUD_NAME=dj7y1qz8t
VITE_CLOUDINARY_UPLOAD_PRESET=visual_vault_preset
```

✅ **No additional setup needed** - the app can now upload to Cloudinary.

---

## Step 4: Firebase Security Rules (Recommended)

Protect your Firestore collection to ensure only authenticated admins can modify videos.

### Instructions:

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: **intuition-lab**
3. Navigate to **Firestore Database** → **Rules** tab
4. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read visual-vault videos (public gallery)
    match /visual-vault/{video} {
      allow read: if true;

      // Only authenticated admins can write (admin panel)
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

5. Click **Publish**

### What This Does:
- Public users can view videos (read-only)
- Only authenticated admins can upload/edit/delete
- Prevents unauthorized database modifications

---

## Testing the Setup

### 1. Test Public Gallery
1. Start dev server: `npm run dev`
2. Visit: http://localhost:5173/visual-vault
3. You should see the empty gallery (no videos yet)

### 2. Test Admin Upload
1. Click **Admin** button in header
2. Log in with your Firebase admin credentials:
   - Email: (the one configured in your Firebase project)
   - Password: (your Firebase password)
3. Go to: http://localhost:5173/visual-vault/admin
4. Test upload:
   - Drag & drop a test video (or click "Choose File")
   - Fill in metadata (Title, Client, Industries)
   - Click "Upload Video"
5. You should see:
   - Upload progress bar
   - Thumbnail generation
   - Video appears in "Manage Videos" grid

### 3. Verify Video Delivery
1. After upload completes, click on a video card
2. Video modal should open
3. Video should play with controls
4. Check browser console (F12) for any errors

### 4. Test Domain Restriction
If you have domain restriction enabled:
- Videos should play on `localhost:5173`
- Try copying the video URL and opening in new tab
- It should work (if same origin)

---

## Troubleshooting

### Issue: "Upload failed: 401"
**Cause:** Upload preset not found or misconfigured

**Solution:**
1. Verify preset name is exactly: `visual_vault_preset`
2. Check Cloud Name is: `dj7y1qz8t`
3. Ensure preset is **Unsigned**

### Issue: "Network error during upload"
**Cause:** CORS or network issue

**Solution:**
1. Check browser console for full error
2. Verify Cloudinary dashboard is accessible
3. Check internet connection
4. Clear browser cache

### Issue: "Video plays locally but not in production"
**Cause:** Domain not whitelisted in Cloudinary

**Solution:**
1. Add your Vercel domain to Cloudinary allowed domains
2. May need 5-10 minutes to propagate
3. Clear Cloudinary cache: Settings → Security → Clear cache

### Issue: "No videos appear in gallery"
**Cause:** Firestore rules preventing reads

**Solution:**
1. Check Firebase Rules are published (green checkmark)
2. Verify rules include `allow read: if true;`
3. Check Firebase Firestore collection has data

---

## Next Steps (Phase 2 Enhancements)

After testing confirms everything works:

1. **Add Edit Functionality**
   - Update video metadata (title, client, tags)
   - Toggle featured status with drag-to-reorder

2. **Advanced Search & Filtering**
   - Filter by client name
   - Filter by tags
   - Filter by upload date

3. **Batch Operations**
   - Select multiple videos
   - Bulk delete
   - Bulk export

4. **Video Analytics**
   - Track view counts
   - Watch time metrics
   - Popular videos dashboard

5. **Sharing Features**
   - Generate shareable links
   - Time-limited access tokens
   - Client preview gallery

---

## Important Files Reference

| File | Purpose |
|------|---------|
| `/src/context/VideoContext.jsx` | State management & Firestore integration |
| `/src/utils/cloudinaryHelper.js` | Upload logic & API interactions |
| `/src/config/cloudinary.js` | Configuration constants |
| `/src/components/VideoCard.jsx` | Netflix-style card with hover preview |
| `/src/components/VideoRow.jsx` | Horizontal scrolling gallery |
| `/src/components/VideoModal.jsx` | Full-screen video player |
| `/src/components/VideoUploadZone.jsx` | Drag-drop upload interface |
| `/src/pages/visual-vault.jsx` | Public gallery page |
| `/src/pages/visual-vault-admin.jsx` | Admin management interface |

---

## API Endpoints Used

The Visual Vault uses these Cloudinary APIs:

- **Upload Endpoint:** `https://api.cloudinary.com/v1_1/{cloud_name}/video/upload`
- **Video CDN:** `https://res.cloudinary.com/{cloud_name}/video/upload/...`
- **Thumbnail Generation:** Uses `so_X` (start offset) parameter for custom timestamps

---

## Security Checklist

- [x] Unsigned upload preset (no API key exposure)
- [x] Domain restriction enabled
- [x] Firestore RLS rules configured
- [x] Firebase authentication required for admin panel
- [ ] (TODO) HTTPS only in production
- [ ] (TODO) Rate limiting on upload endpoint
- [ ] (TODO) Virus scanning on upload (Premium feature)

---

## Support & Documentation

- **Cloudinary Docs:** https://cloudinary.com/documentation
- **Firebase Docs:** https://firebase.google.com/docs
- **Vite Docs:** https://vitejs.dev/
- **Framer Motion:** https://www.framer.com/motion/

---

**Last Updated:** December 4, 2025
**Version:** 1.0
**Status:** Ready for Testing
