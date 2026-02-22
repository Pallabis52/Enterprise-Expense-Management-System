
$files = Get-ChildItem -Path "src\main\java\com\expensemanagement" -Recurse -Filter "*.java"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $newContent = $content -replace 'package com.ExpenseManagement', 'package com.expensemanagement'
    $newContent = $newContent -replace 'import com.ExpenseManagement', 'import com.expensemanagement'
    if ($content -ne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "Updated $($file.Name)"
    }
}
