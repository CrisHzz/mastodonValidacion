# Script para crear un Quality Gate estricto en SonarQube
# Asegurate de que SonarQube este corriendo en http://localhost:9000

$sonarUrl = "http://localhost:9000"
$token = "sqp_593e9d896b693d9971ad3904acda36819827cb99"
$projectKey = "mastodonte"
$qualityGateName = "Strict_Quality_Gate_Demo"

# Crear encabezados de autenticacion
$base64Token = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${token}:"))
$headers = @{
    "Authorization" = "Basic $base64Token"
}

Write-Host "=== Configurando Quality Gate Estricto ===" -ForegroundColor Cyan
Write-Host ""

# 1. Crear el Quality Gate
Write-Host "1. Creando Quality Gate '$qualityGateName'..." -ForegroundColor Yellow
try {
    $createQGResponse = Invoke-RestMethod -Uri "$sonarUrl/api/qualitygates/create" -Method Post -Headers $headers -Body @{
        name = $qualityGateName
    } -ContentType "application/x-www-form-urlencoded"
    
    $qgId = $createQGResponse.id
    Write-Host "   [OK] Quality Gate creado con ID: $qgId" -ForegroundColor Green
}
catch {
    Write-Host "   [INFO] Quality Gate ya existe, obteniendo ID..." -ForegroundColor Gray
    $listQGResponse = Invoke-RestMethod -Uri "$sonarUrl/api/qualitygates/list" -Method Get -Headers $headers
    $existingQG = $listQGResponse.qualitygates | Where-Object { $_.name -eq $qualityGateName }
    
    if ($existingQG) {
        $qgId = $existingQG.id
        Write-Host "   [OK] Usando Quality Gate existente con ID: $qgId" -ForegroundColor Green
    }
    else {
        Write-Host "   [ERROR] Error al obtener el Quality Gate" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# 2. Agregar condiciones estrictas
Write-Host "2. Agregando condiciones estrictas..." -ForegroundColor Yellow

$conditions = @(
    @{ metric = "new_coverage"; op = "LT"; error = "80" },
    @{ metric = "new_duplicated_lines_density"; op = "GT"; error = "3" },
    @{ metric = "new_maintainability_rating"; op = "GT"; error = "1" },
    @{ metric = "new_reliability_rating"; op = "GT"; error = "1" },
    @{ metric = "new_security_rating"; op = "GT"; error = "1" },
    @{ metric = "new_security_hotspots_reviewed"; op = "LT"; error = "100" },
    @{ metric = "new_violations"; op = "GT"; error = "0" }
)

foreach ($condition in $conditions) {
    try {
        Invoke-RestMethod -Uri "$sonarUrl/api/qualitygates/create_condition" -Method Post -Headers $headers -Body @{
            gateName = $qualityGateName
            metric = $condition.metric
            op = $condition.op
            error = $condition.error
        } -ContentType "application/x-www-form-urlencoded" | Out-Null
        
        Write-Host "   [OK] Condicion agregada: $($condition.metric)" -ForegroundColor Green
    }
    catch {
        Write-Host "   [INFO] Condicion ya existe o no se pudo agregar: $($condition.metric)" -ForegroundColor Gray
    }
}

Write-Host ""

# 3. Asignar el Quality Gate al proyecto
Write-Host "3. Asignando Quality Gate al proyecto '$projectKey'..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$sonarUrl/api/qualitygates/select" -Method Post -Headers $headers -Body @{
        gateName = $qualityGateName
        projectKey = $projectKey
    } -ContentType "application/x-www-form-urlencoded" | Out-Null
    
    Write-Host "   [OK] Quality Gate asignado exitosamente" -ForegroundColor Green
}
catch {
    Write-Host "   [ERROR] Error al asignar el Quality Gate: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Configuracion Completa ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ahora ejecuta el scanner nuevamente:" -ForegroundColor White
Write-Host "  npx sonarqube-scanner" -ForegroundColor Yellow
Write-Host ""
Write-Host "El proyecto deberia FALLAR el Quality Gate" -ForegroundColor Red
Write-Host "Visita: $sonarUrl/dashboard?id=$projectKey" -ForegroundColor White
Write-Host ""
