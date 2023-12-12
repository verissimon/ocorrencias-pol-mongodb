import { Point, UpdateOccurrence, deleteOccurrence, map, selectedOcrr } from "./map"

export function createPopupContent(point: Point) {
    const div = document.createElement('div')
    const titulo = document.createElement('p')
    const tipo = document.createElement('p')
    const data = document.createElement('p')
    const button = document.createElement('button')
    const buttonUpdate = document.createElement('button')
    const updateAlert = document.createElement('p');

    titulo.textContent = `Título: ${point.titulo}`;
    titulo.style.fontWeight = 'bold';
    titulo.style.fontSize = "12px";

    tipo.textContent = `Tipo: ${point.tipo}`;
    tipo.style.fontWeight = 'bold';
    tipo.style.fontSize = "12px";


    data.textContent = `Data: ${new Date(point.data).toLocaleString()}`;
    data.style.fontWeight = 'bold';
    data.style.fontSize = "12px";


    updateAlert.textContent = '* Para atualizar uma ocorrência, insira os novos valores no formulário e clique no botão "Atualizar ocorrência" em seguida.'

    button.type = 'button';
    button.className = 'delete';
    button.textContent = 'Deletar ocorrencia';

    buttonUpdate.type = 'button';
    buttonUpdate.className = 'update';
    buttonUpdate.textContent = 'Atualizar ocorrencia';

    div.appendChild(titulo);
    div.appendChild(tipo);
    div.appendChild(data);
    div.appendChild(button);
    div.appendChild(buttonUpdate);
    div.appendChild(updateAlert);


    button?.addEventListener('click', async () => {
        if(!selectedOcrr){
            console.error('toDelete é indefinido.');
            return
        }
        const deletou = await deleteOccurrence(selectedOcrr)
        if (deletou) {
            const marker = selectedOcrr.marker;
            marker.closePopup();
            map.removeLayer(marker)
        }
    });

    buttonUpdate?.addEventListener('click', async () => {

        // Verificação para evitar toDelete indefinido
        if (!selectedOcrr) {
            console.error('toDelete é indefinido.');
            return
        }
        const atualizou = await UpdateOccurrence(selectedOcrr)
        if (atualizou) {
            const marker = selectedOcrr.marker;
            marker.closePopup();
            const newPopupContent = createPopupContent(point);
            marker.bindPopup(newPopupContent);
            marker.openPopup();
        }
    })
    return div
}