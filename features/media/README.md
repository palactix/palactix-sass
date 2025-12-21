# Media Upload Feature

## Overview
Chunked file upload system for images and videos with progress tracking, pause/resume, and retry capabilities.

## Features
- ✅ **Chunked Upload**: Files split into 1MB chunks for reliable uploads
- ✅ **Progress Tracking**: Real-time upload progress (0-100%)
- ✅ **Pause/Resume**: Pause and resume uploads
- ✅ **Retry Logic**: Automatic retry with exponential backoff (3 attempts)
- ✅ **Error Handling**: Clear error messages with manual retry option
- ✅ **File Validation**: 50MB max file size
- ✅ **Alt Text/Captions**: Add descriptions during or after upload
- ✅ **Memory Management**: Automatic cleanup of blob URLs

## Architecture

```
features/media/
├── types/media.types.ts       # TypeScript types and interfaces
├── api/
│   ├── media.api.ts          # API functions
│   └── media.queries.ts      # React Query hooks
└── utils/
    └── chunk-uploader.ts     # Core chunking logic
```

## Usage

### In Components

```typescript
import { MediaUploader } from "@/components/scheduler/MediaUploader";

// Use within a form with React Hook Form
<MediaUploader maxItems={10} />
```

### Direct API Usage

```typescript
import { uploadFileInChunks } from "@/features/media/utils/chunk-uploader";

const url = await uploadFileInChunks(file, {
  onProgress: (progress) => {
    console.log(`${progress.progress}% uploaded`);
  },
  onComplete: (url) => {
    console.log("Upload complete:", url);
  },
  onError: (error) => {
    console.error("Upload failed:", error);
  },
});
```

### Advanced Usage with ChunkUploader Class

```typescript
import { ChunkUploader } from "@/features/media/utils/chunk-uploader";

const uploader = new ChunkUploader(file, {
  chunkSize: 1024 * 1024, // 1MB (default)
  maxRetries: 3,
  retryDelay: 1000,
  onProgress: (progress) => { /* ... */ },
});

// Start upload
await uploader.start();

// Pause
uploader.pause();

// Resume
await uploader.resume();

// Cancel
await uploader.cancel();
```

## API Endpoints

All endpoints use the org context from URL: `/organizations/{orgId}/media/upload`

### 1. Initialize Upload
**POST** `/init`

**Request:**
```json
{
  "filename": "video.mp4",
  "filesize": 52428800,
  "mimetype": "video/mp4"
}
```

**Response:**
```json
{
  "upload_id": "uuid-here",
  "message": "Upload initialized"
}
```

### 2. Upload Chunk
**POST** `/chunk`

**Request:** `multipart/form-data`
- `chunk`: Blob (binary data)
- `chunk_index`: number (0-based)
- `total_chunks`: number
- `upload_id`: string

**Response:**
```json
{
  "chunk_index": 0,
  "message": "Chunk uploaded"
}
```

### 3. Complete Upload
**POST** `/complete`

**Request:**
```json
{
  "upload_id": "uuid-here"
}
```

**Response:**
```json
{
  "url": "https://cdn.example.com/media/filename.mp4",
  "media_id": "media-uuid",
  "filename": "video.mp4",
  "filesize": 52428800,
  "mimetype": "video/mp4"
}
```

### 4. Cancel Upload
**POST** `/cancel`

**Request:**
```json
{
  "upload_id": "uuid-here"
}
```

**Response:**
```json
{
  "message": "Upload cancelled"
}
```

### 5. Upload Status (Optional)
**GET** `/upload/{uploadId}/status`

**Response:**
```json
{
  "upload_id": "uuid-here",
  "status": "uploading",
  "progress": 65,
  "uploaded_chunks": 13,
  "total_chunks": 20
}
```

## Upload States

- `pending` - File queued for upload
- `uploading` - Upload in progress
- `paused` - Upload paused by user
- `completed` - Upload successful
- `error` - Upload failed
- `cancelled` - Upload cancelled by user

## Configuration

### Chunk Size
Default: 1MB (1024 * 1024 bytes)

Can be customized:
```typescript
new ChunkUploader(file, { chunkSize: 2 * 1024 * 1024 }); // 2MB chunks
```

### Retry Configuration
- **Max Retries**: 3 attempts per chunk
- **Retry Delay**: Exponential backoff (1s, 2s, 4s)
- **Timeout**: 15 seconds (from axios config)

## Error Handling

Errors are automatically handled with:
1. Automatic retry (up to 3 times)
2. Exponential backoff between retries
3. User-friendly error messages
4. Manual retry button in UI

## Memory Management

- Blob URLs created for previews are automatically revoked after upload
- File references cleared from state after successful upload
- Uploader instances cleaned up on component unmount

## Browser Compatibility

Requires:
- `File.slice()` API (All modern browsers)
- `FormData` API (All modern browsers)
- `Blob` API (All modern browsers)

## Performance

- **Concurrent Uploads**: 1 file at a time (configurable)
- **Chunk Size**: 1MB (optimal for most networks)
- **Memory Usage**: ~1MB per active upload
- **Network**: Handles temporary disconnections with retry logic
