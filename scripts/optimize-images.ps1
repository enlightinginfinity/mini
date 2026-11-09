Add-Type -AssemblyName System.Drawing

function Optimize-ImageFile {
    param(
        [string]$Path,
        [int]$MaxDim = 960
    )
    
    $fullPath = [System.IO.Path]::GetFullPath($Path)
    if (!(Test-Path $fullPath)) { return }
    
    $fileBytes = [System.IO.File]::ReadAllBytes($fullPath)
    $ms = New-Object System.IO.MemoryStream(,$fileBytes)
    $img = [System.Drawing.Image]::FromStream($ms)
    
    $w = $img.Width
    $h = $img.Height
    $origLen = $fileBytes.Length
    
    if ($w -gt $MaxDim -or $h -gt $MaxDim) {
        $scale = [math]::Min($MaxDim / $w, $MaxDim / $h)
        $newW = [int][math]::Round($w * $scale)
        $newH = [int][math]::Round($h * $scale)
        
        $bmp = New-Object System.Drawing.Bitmap($newW, $newH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $g.Clear([System.Drawing.Color]::Transparent)
        
        $g.DrawImage($img, 0, 0, $newW, $newH)
        $g.Dispose()
        $img.Dispose()
        $ms.Dispose()
        
        $outMs = New-Object System.IO.MemoryStream
        $bmp.Save($outMs, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        
        $newBytes = $outMs.ToArray()
        $outMs.Dispose()
        
        [System.IO.File]::WriteAllBytes($fullPath, $newBytes)
        
        $oldMB = [math]::Round($origLen / 1MB, 2)
        $newMB = [math]::Round($newBytes.Length / 1MB, 2)
        Write-Output "$([System.IO.Path]::GetFileName($fullPath)): ${w}x${h} (${oldMB}MB) -> ${newW}x${newH} (${newMB}MB)"
    } else {
        $img.Dispose()
        $ms.Dispose()
        $curMB = [math]::Round($origLen / 1MB, 2)
        Write-Output "$([System.IO.Path]::GetFileName($fullPath)): Kept ${w}x${h} (${curMB}MB)"
    }
}

Write-Output "Optimizing photo assets..."
Get-ChildItem public/assets/photos/*.png | ForEach-Object {
    Optimize-ImageFile -Path $_.FullName -MaxDim 960
}

Write-Output "`nOptimizing face assets..."
Optimize-ImageFile -Path "public/assets/face.png" -MaxDim 512
Optimize-ImageFile -Path "public/assets/character/face.png" -MaxDim 512
