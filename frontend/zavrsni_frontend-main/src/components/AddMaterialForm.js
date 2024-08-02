import React, { useState } from 'react';
import '../styles/AddMaterialForm.css';
import { saveMaterial } from '../modules/fetchData';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../modules/firebase';

function AddMaterialForm({ updateMaterials }) {
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const currentDate = new Date();
            const storageRef = ref(storage, `Materials/${name}_${currentDate.getTime()}`);
            const uploadMaterial = uploadBytesResumable(storageRef, file);

            uploadMaterial.on("state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(progress.toFixed());
                },
                (error) => {
                    console.error('Error uploading material:', error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadMaterial.snapshot.ref);
                        await saveMaterial(name, file.type, downloadURL, new Date().toISOString());
                        setName('');
                        setProgress(0);
                        
                        updateMaterials();
                    } catch (error) {
                        console.error('Error saving material:', error);
                    }
                }
            );
        } catch (error) {
            console.error('Error uploading material:', error);
        }
    };

    return (
        <form className="add-material-form" onSubmit={handleSubmit}>
            <div>
                <label>Naziv:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label htmlFor="fileInput">Odaberite datoteku:</label>
                <input type="file" id="fileInput" onChange={handleFileChange} accept="image/*, video/*, application/pdf,application/zip" required />
            </div>
            <progress value={progress} max="100" />
            <button type="submit">Dodaj instrukciju</button>
        </form>
    );
}

export default AddMaterialForm;
