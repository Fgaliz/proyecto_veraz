document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const documentInput = document.getElementById('documentNumber');
    const validateBtn = document.getElementById('validateBtn');
    const resultContent = document.getElementById('resultContent');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const statusMessage = document.getElementById('statusMessage');
    
    // API endpoint configuration
    const API_BASE_URL = 'https://api.bcra.gob.ar'; // Demo API
    const API_ENDPOINT = '/centraldedeudores/v1.0/Deudas/'; // Demo endpoint
    //Api function to fetch user data from the API
    async function handleApiResponse() {
    const url = `https://api.bcra.gob.ar/centraldedeudores/v1.0/Deudas/${documentInput.value}`;

    try {
        const response = await fetch(url);

        // Check if the response is successful (status in 200–299)
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response body
        const data = await response.json();

        // Use the data (e.g., log or display it)
        console.log(data);
        displayUserData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    }

// Call the function
 

    // Function to display user data in the result area
    function displayUserData(response) {
        // Format the user data as a JSON string for display    
        const formattedData = JSON.stringify(response, null, 2);
        
        // Create a more user-friendly display
        resultContent.innerHTML = 
`
    <table class="data-table">
        <thead>
            <tr>
                <th>API Status</th>
                <th>Identificación</th>
                <th>Denominación</th>
                <th>Periodo</th>
                <th>Entidad</th>
                <th>Situación</th>
                <th>Fecha Sit1</th>
                <th>Monto</th>
                <th>Días Atraso Pago</th>
                <th>Refinanciaciones</th>
                <th>Recategorización Oblig.</th>
                <th>Situación Jurídica</th>
                <th>Irrec. Disp. Técnica</th>
                <th>En Revisión</th>
                <th>Proceso Judicial</th>
            </tr>
        </thead>
        <tbody>
            ${response.results.periodos.flatMap(periodo => 
                periodo.entidades.map(entidad => `
                    <tr>
                        <td><span class="status-badge ${response.status === 200 ? 'status-200' : 'status-other'}">${response.status}</span></td>
                        <td>${response.results.identificacion}</td>
                        <td>${response.results.denominacion}</td>
                        <td>${periodo.periodo}</td>
                        <td>${entidad.entidad}</td>
                        <td>${entidad.situacion}</td>
                        <td>${entidad.fechaSit1}</td>
                        <td>${entidad.monto}</td>
                        <td>${entidad.diasAtrasoPago}</td>
                        <td class="${entidad.refinanciaciones ? 'boolean-yes' : 'boolean-no'}">${entidad.refinanciaciones ? '✔️ Sí' : '❌ No'}</td>
                        <td class="${entidad.recategorizacionOblig ? 'boolean-yes' : 'boolean-no'}">${entidad.recategorizacionOblig ? '✔️ Sí' : '❌ No'}</td>
                        <td class="${entidad.situacionJuridica ? 'boolean-yes' : 'boolean-no'}">${entidad.situacionJuridica ? '✔️ Sí' : '❌ No'}</td>
                        <td class="${entidad.irrecDisposicionTecnica ? 'boolean-yes' : 'boolean-no'}">${entidad.irrecDisposicionTecnica ? '✔️ Sí' : '❌ No'}</td>
                        <td class="${entidad.enRevision ? 'boolean-yes' : 'boolean-no'}">${entidad.enRevision ? '✔️ Sí' : '❌ No'}</td>
                        <td class="${entidad.procesoJud ? 'boolean-yes' : 'boolean-no'}">${entidad.procesoJud ? '✔️ Sí' : '❌ No'}</td>
                    </tr>
                `).join('')
            ).join('')}
        </tbody>
    </table>
`;
    }
    
    
    // Function to validate document number
    async function validateDocument() {
        const documentNumber = documentInput.value.trim().toString();
        
        // Validate input
        if (!documentNumber) {
            showStatusMessage("Please enter a document number", "error");
            return;
        }
        
        // Show loading indicator
        loadingIndicator.style.display = 'block';
        statusMessage.style.display = 'none';
        validateBtn.disabled = true;
        
        
        //const response = await fetch(`${API_BASE_URL}${API_ENDPOINT}${documentNumber}`);
        //displayUserData(response);
        //print(response);
       
    }
    
    
    // Function to show status messages
    function showStatusMessage(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}-message`;
        statusMessage.style.display = 'flex';
        
        // Add appropriate icon
        const icon = document.createElement('i');
        icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        statusMessage.prepend(icon);
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    // Event listener for the validate button
    validateBtn.addEventListener('click', handleApiResponse);
    
    // Allow pressing Enter to validate
    documentInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleApiResponse();
        }
    });
   
    

    

    
    // Change placeholder every 3 seconds
    setInterval(cyclePlaceholder, 3000);
    
    // Pre-fill with a sample document for easy testing
    documentInput.value = "20949132048";
});