param(
    [string] $BaseFileName, #oldfile name
    [string] $ChangedFileName #newfile(수정된) name
)

$ErrorActionPreference = 'Stop'

#경로출력 함수
function resolve($relativePath) {
    (Resolve-Path $relativePath).Path
}

#경로설정 함수
$BaseFileName = resolve $BaseFileName
$ChangedFileName = resolve $ChangedFileName

# 읽기 전용 파일은 문서 비교 기능을 사용할 수 없다.
$baseFile = Get-ChildItem $BaseFileName
if ($baseFile.IsReadOnly) {
    $baseFile.IsReadOnly = $false
}

$DoNotSaveChanges = 0
$Target = 2

try {
    $word = New-Object -ComObject Word.Application #word 객체 생성
    $word.Visible = $true
    $document = $word.Documents.Open($BaseFileName, $false, $false)
    $document.Compare($ChangedFileName, [ref]"Comparison", [ref]$Target, [ref]$true, [ref]$true)

    $word.ActiveDocument.Saved = 1

    # 열었던 oldfile 문서 창을 닫고 비교창만 있도록 함:
    $document.Close([ref]$DoNotSaveChanges)
} catch {
    Add-Type -AssemblyName System.Windows.Forms
    [System.Windows.Forms.MessageBox]::Show($_.Exception)
}
