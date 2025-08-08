import { useState } from "react";
import { auth } from "../firebase/firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { storage } from "../firebase/firebase.config"; 

/**
 * Componente para upload e atualização da foto de perfil do usuário.
 *
 * Permite ao usuário selecionar uma imagem, visualizar uma prévia, cancelar ou salvar a nova foto de perfil.
 * Realiza validações de tipo e tamanho do arquivo, faz upload para o Firebase Storage e atualiza o perfil do usuário no Firebase Auth.
 *
 * @component
 * @param {Object} props
 * @param {string|null} props.currentPhotoURL - URL atual da foto de perfil do usuário (pode ser null).
 * @param {function} props.onUploadSuccess - Callback chamado após upload bem-sucedido, recebe a nova URL da foto.
 *
 * @example
 * <ProfilePictureUpload
 *   currentPhotoURL={user.photoURL}
 *   onUploadSuccess={(url) => setUserPhotoURL(url)}
 * />
 */
export default function ProfilePictureUpload({ currentPhotoURL, onUploadSuccess }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(currentPhotoURL || null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Validar tipo de arquivo
            if (!selectedFile.type.startsWith('image/')) {
                alert('Por favor, selecione apenas arquivos de imagem.');
                return;
            }
            
            // Validar tamanho (max 5MB)
            if (selectedFile.size > 5 * 1024 * 1024) {
                alert('A imagem deve ter no máximo 5MB.');
                return;
            }

            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    }

    const handleUpload = async () => {
        if (!file) return alert("Selecione uma imagem primeiro.");
        if (!auth.currentUser) return alert("Usuário não autenticado.");
        
        setLoading(true);

        try {
            // Criar referência única para o arquivo
            const fileRef = ref(storage, `profile-pictures/${auth.currentUser.uid}/${Date.now()}-${file.name}`);
            
            // Upload do arquivo
            const snapshot = await uploadBytes(fileRef, file);
            
            // Obter URL de download
            const downloadURL = await getDownloadURL(snapshot.ref);
            
            // Atualizar perfil do usuário no Firebase Auth
            await updateProfile(auth.currentUser, {
                photoURL: downloadURL
            });

            // Callback para atualizar o estado no componente pai
            if (onUploadSuccess) {
                onUploadSuccess(downloadURL);
            }

            alert("Foto de perfil atualizada com sucesso!");
            setFile(null);
            
        } catch (error) {
            console.error("Erro no upload:", error);
            alert("Erro ao fazer upload da imagem: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    const removePreview = () => {
        setFile(null);
        setPreview(currentPhotoURL || null);
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            {/* Preview da imagem */}
            <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                    {preview ? (
                        <img 
                            src={preview} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-white text-3xl font-bold">
                            {auth.currentUser?.displayName?.charAt(0) || auth.currentUser?.email?.charAt(0) || '?'}
                        </span>
                    )}
                </div>
                
                {/* Botão de upload */}
                <label 
                    htmlFor="photo-upload" 
                    className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 cursor-pointer shadow-lg"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </label>
                
                <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {/* Botões de ação */}
            {file && (
                <div className="flex space-x-3">
                    <button 
                        onClick={removePreview}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleUpload}
                        disabled={loading}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Enviando...
                            </>
                        ) : (
                            'Salvar Foto'
                        )}
                    </button>
                </div>
            )}

            <p className="text-sm text-gray-500 text-center">
                Clique no ícone da câmera para alterar sua foto<br/>
                Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
            </p>
        </div>
    );
}