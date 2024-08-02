import React, { useState, useEffect } from 'react';
import AddMaterialForm from './AddMaterialForm';
import '../styles/Materials.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { deleteMaterial, getMaterials } from '../modules/fetchData';

function Materials() {
    const [showModal, setShowModal] = useState(false);
    const [materials, setMaterials] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    useEffect(() => {
        async function fetchMaterials() {
            try {
                const materialsData = await getMaterials();
                setMaterials(materialsData);
            } catch (error) {
                console.error('Error fetching materials:', error);
            }
        }

        fetchMaterials();
    }, []);

    const handleDeleteMaterial = async (id) => {
        try {
            await deleteMaterial(id);
            setMaterials(materials.filter((material) => material.id !== id));
        } catch (error) {
            console.error('Error deleting material:', error);
        }
    };

    const openMaterial = (material) => {
        if (material.contentType === 'application/pdf') {
            window.open(material.downloadURL, '_blank');
        } else {
            setSelectedMaterial(material);
        }
    };

    const updateMaterials = async () => {
        try {
            const materialsData = await getMaterials();
            setMaterials(materialsData);
        } catch (error) {
            console.error('Error updating materials:', error);
        }
    };

    return (
        <div className="materials-container">
            <div className="header">
                <h2>INSTRUKCIJE</h2>
                <button className="add-material-button" onClick={() => setShowModal(true)}>
                    <FontAwesomeIcon icon={faPlus} style={{ fontSize: '1.1em', marginRight: '5px' }} /> DODAJ
                    INSTRUKCIJE
                </button>
            </div>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <AddMaterialForm updateMaterials={updateMaterials} />
                    </div>
                </div>
            )}
            {selectedMaterial && (
                <div className="modal-overlay" onClick={() => setSelectedMaterial(null)}>
                    <div className="modal-material">
                        <span className="close" onClick={() => setSelectedMaterial(null)}>&times;</span>
                        <div className="material-preview-modal">
                            {selectedMaterial.contentType.startsWith('image/') && (
                                <img src={selectedMaterial.downloadURL} alt={selectedMaterial.name} className="material-image-modal" />
                            )}
                            {selectedMaterial.contentType.startsWith('video/') && (
                                <video controls className="material-video">
                                    <source src={selectedMaterial.downloadURL} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                            {selectedMaterial.contentType === 'application/pdf' && (
                                <embed src={selectedMaterial.downloadURL} type="application/pdf" className="material-pdf" />
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className="materials-container2">
                {materials.map((material) => (
                    <div key={material.id} className="materials-box">
                        <div className="materials-actions">
                            <FontAwesomeIcon icon={faTimes} size="lg" className="delete-icon" onClick={() => handleDeleteMaterial(material.id)} />
                        </div>
                        <div className="material-preview" onClick={() => openMaterial(material)}>
                            {material.contentType.startsWith('image/') && (
                                <img src={material.downloadURL} alt={material.name} className="material-image" />
                            )}
                            {material.contentType.startsWith('video/') && (
                                <video controls className="material-video">
                                    <source src={material.downloadURL} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                            {material.contentType === 'application/pdf' && (
                                <embed src={material.downloadURL} type="application/pdf" className="material-pdf" />
                            )}
                            {material.contentType === 'application/zip' && (
                                <div className="material-zip">ZIP</div>
                            )}
                        </div>
                        <div className="materials-title">{material.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Materials;
