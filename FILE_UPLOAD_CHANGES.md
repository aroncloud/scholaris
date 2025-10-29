# File Upload Configuration - Server Actions Body Size Limit

## Problem
Server Actions in Next.js have a default maximum body size limit of 1MB, which is insufficient for uploading multiple documents (8 files) during the admission request process.

## Solution
Configured the `serverActions.bodySizeLimit` in `next.config.ts` to 5MB, allowing Server Actions to handle larger file uploads without requiring a separate API route.

## Changes Made

### 1. Updated Next.js Configuration
**File:** `next.config.ts`

Added the following configuration:
```typescript
experimental: {
  serverActions: {
    bodySizeLimit: '5mb',
  },
}
```

This increases the maximum request body size for all Server Actions from the default 1MB to 5MB.

### 2. Server Action (No Changes Required)
**File:** `src/actions/requestSubmissionActions.ts`

The existing `uploadApplicationDocuments()` server action continues to work as before:
- Accepts 8 document files + matricule parameter
- Uploads files to Cloudflare R2 storage using `uploadFile()` from `src/lib/fileUpload.ts`
- Returns document array with URLs in the standard format: `{ code, error, data }`

### 3. Hook (No Changes Required)
**File:** `src/hooks/useAdmissionForm.ts`

The hook continues to use the server action directly:
```typescript
const uploadResult = await uploadApplicationDocuments({
  cniRecto: formData.documents.cniRecto,
  cniVerso: formData.documents.cniVerso,
  photo4x4: formData.documents.photo4x4,
  releveNotes: formData.documents.releveNotes,
  diplome: formData.documents.diplome,
  acteNaissance: formData.documents.acteNaissance,
  pageResultatConcours: formData.documents.pageResultatConcours,
  pageNomConcours: formData.documents.pageNomConcours,
  matricule: applicationCode
});
```

## Why This Solution?

### Advantages of Increasing Body Size Limit:
1. **Simpler Architecture**: No need for separate API routes
2. **Consistent Pattern**: Uses the same Server Action pattern as the rest of the application
3. **Less Code**: No additional route handlers or fetch() calls needed
4. **Better Integration**: Works seamlessly with existing error handling and authentication
5. **Type Safety**: Full TypeScript support with Server Actions

### Alternative Considered:
Initially considered creating a dedicated API route (`/api/upload-documents`) to bypass the 1MB limit, but this approach was more complex and added unnecessary code when a simple configuration change solved the problem.

## Body Size Limit Options

The `bodySizeLimit` option accepts:
- Number of bytes: `1000000` (1MB)
- String format with units: `'500kb'`, `'2mb'`, `'5mb'`, etc.

### Current Configuration: `'5mb'`
This allows for:
- 8 documents with average size of ~625KB each
- Or a mix of smaller and larger files totaling up to 5MB

### When to Increase Further:
If you need to upload larger files (e.g., high-resolution scans, videos), you can increase the limit:
```typescript
bodySizeLimit: '10mb',  // For larger file uploads
bodySizeLimit: '50mb',  // For very large files
```

**Important**: Be mindful of:
- Server memory usage
- Upload time for users
- Potential DDoS attack vectors with very large limits

## Other File Upload Actions

**Note:** The following server action also uses file upload:
- `src/actions/studentMyAbsencesAction.ts` - `submitJustification()` function

This action uploads a single file (typically a medical certificate or justification document). With the new 5MB limit, it can now handle larger PDF scans or high-resolution images.

## Testing Checklist

- [x] Configure bodySizeLimit to 5MB
- [ ] Restart development server (required for config changes)
- [ ] Upload 8 documents in admission form
- [ ] Verify all documents are uploaded to Cloudflare R2
- [ ] Verify document URLs are correctly returned
- [ ] Test with files of various sizes (including > 1MB but < 5MB total)
- [ ] Verify admission request submission completes successfully
- [ ] Check error handling for missing files
- [ ] Check error handling for upload failures
- [ ] Test with total file size exceeding 5MB (should fail gracefully)

## Important Note: Restart Required

**After changing `next.config.ts`, you MUST restart your development server for the changes to take effect.**

```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
npm run dev
```

## Environment Variables Required

Ensure these environment variables are set:
- `STUDENT_FILE_NAME_SRC` - Base path for student files
- `CLOUDFLARE_FILE_BASE_URL` - Public URL for uploaded files
- `CLOUDFLARE_BUCKET_DOMAIN` - Cloudflare R2 endpoint
- `R2_ACCESS_KEY_ID` - R2 access key
- `R2_SECRET_ACCESS_KEY` - R2 secret key
- `ASSET_BUCKET_NAME` - R2 bucket name

## Migration Notes

If you need to increase the limit further in the future:
1. Update the `bodySizeLimit` value in `next.config.ts`
2. Restart the development/production server
3. No code changes required in actions or hooks

If you eventually need to handle files larger than Next.js Server Actions can reasonably handle (e.g., 100MB+ video files), consider:
1. Direct client-to-R2 upload with presigned URLs
2. Chunked upload implementation
3. Dedicated file upload service

---

**Date:** October 27, 2025
**Author:** Claude Code
**Issue:** Server Action 1MB body size limit
**Solution:** Configure bodySizeLimit to 5MB in next.config.ts
