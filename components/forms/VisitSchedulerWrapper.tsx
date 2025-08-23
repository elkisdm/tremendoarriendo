'use client';

import { useState, useEffect } from 'react';
import VisitSchedulerModal from './VisitSchedulerModal';

interface VisitSchedulerWrapperProps {
    buildingName: string;
    buildingId: string;
    unitId?: string;
}

export default function VisitSchedulerWrapper({
    buildingName,
    buildingId,
    unitId
}: VisitSchedulerWrapperProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Función para abrir el modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Escuchar eventos personalizados para abrir el modal desde otros componentes
    useEffect(() => {
        const handleOpenModal = () => {
            console.log('Evento openVisitScheduler recibido, abriendo modal');
            openModal();
        };

        // Escuchar el evento personalizado
        window.addEventListener('openVisitScheduler', handleOpenModal);

        return () => {
            window.removeEventListener('openVisitScheduler', handleOpenModal);
        };
    }, []);

    return (
        <VisitSchedulerModal
            isOpen={isModalOpen}
            onClose={closeModal}
            buildingName={buildingName}
            buildingId={buildingId}
            unitId={unitId}
        />
    );
}
