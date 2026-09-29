import React, { useEffect, useState } from "react";
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001';

export default function UploadImageForm({ beerId: propBeerId, onUploaded }) {
  const [beerId, setBeerId] = useState(propBeerId || '');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const MAX_SIZE = 2 * 1024 * 1024; // 2MB
  const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (propBeerId) setBeerId(propBeerId);
  }, [propBeerId]);

  const handleFileChange = (f) => {
    setError('');
    if (!f) {
      setFile(null);
      setPreviewUrl('');
      return;
    }
    if (!ALLOWED.includes(f.type)) {
      setError('Only JPG, PNG, and WEBP images are allowed');
      setFile(null);
      setPreviewUrl('');
      return;
    }
    if (f.size > MAX_SIZE) {
      setError('Image must be under 2 MB');
      setFile(null);
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(f);
    setFile(f);
    setPreviewUrl(url);
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    setError('');
    if (!beerId) return setError('Enter beer ID');
    if (!file) return setError('Select a valid image file');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch(`${API_BASE}/api/admin/beers/${encodeURIComponent(beerId)}/image`, {
        method: 'POST',
        body: fd
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Upload failed');
      }
      const data = await res.json();
      if (onUploaded) onUploaded(data);
      alert('✅ Uploaded: ' + data.url);
      setFile(null);
    } catch (err) {
      console.error(err);
      setError('Upload failed: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '520px', margin: '0 auto' }}>
      {!propBeerId && (
        <>
          <label style={{ fontWeight: 'bold' }}>Beer ID</label>
          <input value={beerId} onChange={(e) => setBeerId(e.target.value)} placeholder="e.g. 1" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }} />
        </>
      )}

      <label style={{ fontWeight: 'bold' }}>Image File (JPG, PNG, WEBP &lt; 2MB)</label>
      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e.target.files && e.target.files[0])} />

      {error && <div style={{ color: '#e74c3c', fontWeight: 'bold' }}>{error}</div>}

      {previewUrl && (
        <div style={{ textAlign: 'center' }}>
          <img src={previewUrl} alt="preview" style={{ maxWidth: '320px', maxHeight: '240px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #ddd' }} />
          <div style={{ marginTop: '8px' }}>
            <button type="button" onClick={() => { setFile(null); URL.revokeObjectURL(previewUrl); setPreviewUrl(''); }} style={{ padding: '6px 10px', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Remove</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit" disabled={loading || !!error} style={{ padding: '10px 16px', background: loading ? '#95a5a6' : '#16a085', color: 'white', border: 'none', borderRadius: '6px', cursor: loading ? 'default' : 'pointer' }}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
        <button type="button" onClick={() => { setFile(null); if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(''); } setError(''); }} style={{ padding: '10px 16px', background: '#ecf0f1', color: '#2c3e50', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Clear</button>
      </div>
    </form>
  );
}
