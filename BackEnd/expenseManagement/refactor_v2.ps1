
$path = "src\main\java\com\expensemanagement"
if (!(Test-Path $path)) {
    $path = "src\main\java\com\ExpenseManagement"
}

if (Test-Path $path) {
    Write-Host "Processing $path"
    $files = Get-ChildItem -Path $path -Recurse -Filter "*.java"
    foreach ($file in $files) {
        $content = Get-Content $file.FullName -Raw
        $newContent = $content -replace 'package com.ExpenseManagement', 'package com.expensemanagement'
        $newContent = $newContent -replace 'import com.ExpenseManagement', 'import com.expensemanagement'
        if ($content -ne $newContent) {
            Set-Content -Path $file.FullName -Value $newContent -NoNewline -Encoding UTF8
            Write-Host "Updated $($file.Name)"
        }
    }
} else {
    Write-Host "Path not found"
}
