import { useEffect, useRef, useState } from "react";
import "./capturaFotoCamera.css";

function CapturaFotoCamera({ onCapture, onError }) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [aberta, setAberta] = useState(false);
    const [carregando, setCarregando] = useState(false);

    const pararCamera = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
    };

    const fechar = () => {
        pararCamera();
        setAberta(false);
        setCarregando(false);
    };

    const abrir = async () => {
        if (!navigator.mediaDevices?.getUserMedia) {
            onError("A câmera não é suportada por este navegador.");
            return;
        }

        setAberta(true);
        setCarregando(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (erro) {
            console.error("Erro ao acessar câmera:", erro);
            fechar();
            onError("Não foi possível acessar a câmera. Verifique a permissão do navegador.");
        } finally {
            setCarregando(false);
        }
    };

    const capturar = () => {
        const video = videoRef.current;
        if (!video?.videoWidth || !video?.videoHeight) {
            onError("Aguarde a câmera carregar para capturar a foto.");
            return;
        }

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
        const foto = canvas.toDataURL("image/jpeg", 0.85);
        if (foto.length > 5 * 1024 * 1024 * 1.37) {
            onError("A foto capturada ficou maior que 5 MB. Tente novamente.");
            return;
        }

        onCapture(foto);
        fechar();
    };

    useEffect(() => () => pararCamera(), []);

    return (
        <>
            <button type="button" className="btn btn-outline-primary mt-2" onClick={abrir}>📷 Abrir câmera</button>
            {aberta && (
                <div className="captura-camera-fundo" role="dialog" aria-modal="true" aria-label="Capturar foto do aluno">
                    <div className="captura-camera-modal">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0 fw-bold">Capturar foto do aluno</h5>
                            <button type="button" className="btn-close" onClick={fechar} aria-label="Fechar câmera" />
                        </div>
                        <div className="captura-camera-video">
                            {carregando && <span>Ativando câmera...</span>}
                            <video ref={videoRef} autoPlay playsInline muted />
                        </div>
                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <button type="button" className="btn btn-outline-secondary" onClick={fechar}>Cancelar</button>
                            <button type="button" className="btn btn-primary" onClick={capturar} disabled={carregando}>Capturar foto</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CapturaFotoCamera;
