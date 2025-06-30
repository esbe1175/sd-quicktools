function openTool(toolName) {
    const mainContent = document.getElementById('main-content');
    
    switch(toolName) {
        case 'sdxl-resolution':
            loadSDXLResolutionTool();
            break;
        default:
            console.error('Unknown tool:', toolName);
    }
}

function loadSDXLResolutionTool() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="max-w-6xl mx-auto">
            <div class="mb-6">
                <button onclick="goHome()" class="flex items-center text-primary-600 hover:text-primary-700 mb-4">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back to Tools
                </button>
                <h2 class="text-3xl font-bold text-gray-900">SDXL Resolution Tool</h2>
                <p class="text-gray-600 mt-2">Find the nearest SDXL resolution and crop your images</p>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-xl font-semibold mb-4">Input</h3>
                    
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Resolution Mode</label>
                        <select id="resolutionMode" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="standard">SDXL Standard</option>
                            <option value="extended">SDXL Extended</option>
                        </select>
                    </div>
                    
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Input Method</label>
                        <div class="flex space-x-4">
                            <button id="manualBtn" onclick="setInputMethod('manual')" class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">Manual Input</button>
                            <button id="imageBtn" onclick="setInputMethod('image')" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">Upload Image</button>
                        </div>
                    </div>
                    
                    <div id="manualInput" class="mb-6">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Width</label>
                                <input type="number" id="inputWidth" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="1024">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Height</label>
                                <input type="number" id="inputHeight" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="1024">
                            </div>
                        </div>
                    </div>
                    
                    <div id="imageInput" class="mb-6 hidden">
                        <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input type="file" id="imageFile" accept="image/*" class="hidden" onchange="handleImageUpload(event)">
                            <div id="dropZone" onclick="document.getElementById('imageFile').click()" class="cursor-pointer">
                                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                                <p class="mt-2 text-sm text-gray-600">Click to upload an image or drag and drop</p>
                            </div>
                        </div>
                    </div>
                    
                    <div id="cropMode" class="mb-6 hidden">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Crop Mode</label>
                        <select id="cropModeSelect" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="cut">Cut excess (center crop)</option>
                            <option value="fit">Scale to fit (add padding)</option>
                        </select>
                    </div>
                    
                    <button onclick="calculateResolution()" class="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors">
                        Calculate Resolution
                    </button>
                </div>
                
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-xl font-semibold mb-4">Output</h3>
                    <div id="output" class="text-gray-500">
                        Enter dimensions or upload an image to see the nearest SDXL resolution
                    </div>
                </div>
            </div>
        </div>
    `;
}

function goHome() {
    location.reload();
}

let currentInputMethod = 'manual';
let uploadedImage = null;

function setInputMethod(method) {
    currentInputMethod = method;
    const manualBtn = document.getElementById('manualBtn');
    const imageBtn = document.getElementById('imageBtn');
    const manualInput = document.getElementById('manualInput');
    const imageInput = document.getElementById('imageInput');
    const cropMode = document.getElementById('cropMode');
    
    if (method === 'manual') {
        manualBtn.className = 'px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors';
        imageBtn.className = 'px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors';
        manualInput.classList.remove('hidden');
        imageInput.classList.add('hidden');
        cropMode.classList.add('hidden');
    } else {
        imageBtn.className = 'px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors';
        manualBtn.className = 'px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors';
        manualInput.classList.add('hidden');
        imageInput.classList.remove('hidden');
        cropMode.classList.remove('hidden');
    }
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                uploadedImage = {
                    data: e.target.result,
                    width: img.width,
                    height: img.height
                };
                
                const dropZone = document.getElementById('dropZone');
                dropZone.innerHTML = `
                    <img src="${e.target.result}" class="max-w-full max-h-32 mx-auto rounded">
                    <p class="mt-2 text-sm text-gray-600">${img.width}x${img.height}</p>
                `;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function calculateResolution() {
    let inputWidth, inputHeight;
    
    if (currentInputMethod === 'manual') {
        inputWidth = parseInt(document.getElementById('inputWidth').value);
        inputHeight = parseInt(document.getElementById('inputHeight').value);
        
        if (!inputWidth || !inputHeight) {
            alert('Please enter both width and height');
            return;
        }
    } else {
        if (!uploadedImage) {
            alert('Please upload an image first');
            return;
        }
        inputWidth = uploadedImage.width;
        inputHeight = uploadedImage.height;
    }
    
    const resolutionMode = document.getElementById('resolutionMode').value;
    const resolutions = resolutionMode === 'standard' ? SDXL_SUPPORTED_RESOLUTIONS : SDXL_EXTENDED_RESOLUTIONS;
    
    const inputRatio = inputWidth / inputHeight;
    const nearest = findNearestResolution(inputRatio, resolutions);
    
    displayResult(inputWidth, inputHeight, nearest, resolutionMode);
    
    if (currentInputMethod === 'image' && uploadedImage) {
        const cropMode = document.getElementById('cropModeSelect').value;
        processImage(uploadedImage, nearest, cropMode);
    }
}

function findNearestResolution(inputRatio, resolutions) {
    let smallest = null;
    let smallestDiff = Infinity;
    
    for (const resolution of resolutions) {
        const diff = Math.abs(inputRatio - resolution[2]);
        if (diff < smallestDiff) {
            smallestDiff = diff;
            smallest = resolution;
        }
    }
    
    return smallest || [1024, 1024, 1.0];
}

function displayResult(inputWidth, inputHeight, nearest, mode) {
    const output = document.getElementById('output');
    const inputRatio = inputWidth / inputHeight;
    
    output.innerHTML = `
        <div class="space-y-4">
            <div class="border-b pb-4">
                <h4 class="font-semibold text-gray-900">Input Resolution</h4>
                <p class="text-gray-600">${inputWidth} × ${inputHeight} (${inputRatio.toFixed(3)}:1)</p>
            </div>
            
            <div class="border-b pb-4">
                <h4 class="font-semibold text-gray-900">Nearest SDXL Resolution (${mode})</h4>
                <p class="text-gray-600">${nearest[0]} × ${nearest[1]} (${nearest[2].toFixed(3)}:1)</p>
                <p class="text-sm text-gray-500 mt-1">Ratio difference: ${Math.abs(inputRatio - nearest[2]).toFixed(4)}</p>
            </div>
            
            <div class="bg-gray-100 rounded-lg p-4 flex items-center justify-center" style="aspect-ratio: ${nearest[0]}/${nearest[1]}; max-height: 200px;">
                <div class="text-center text-gray-600">
                    <div class="text-lg font-medium">${nearest[0]} × ${nearest[1]}</div>
                    <div class="text-sm">Preview dimensions</div>
                </div>
            </div>
            
            <div id="processedImage"></div>
        </div>
    `;
}

function processImage(image, targetResolution, cropMode) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = function() {
        const [targetWidth, targetHeight] = targetResolution;
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        let dx = 0, dy = 0, dw = targetWidth, dh = targetHeight;
        
        if (cropMode === 'cut') {
            const sourceRatio = img.width / img.height;
            const targetRatio = targetWidth / targetHeight;
            
            if (sourceRatio > targetRatio) {
                sw = img.height * targetRatio;
                sx = (img.width - sw) / 2;
            } else {
                sh = img.width / targetRatio;
                sy = (img.height - sh) / 2;
            }
        } else {
            const sourceRatio = img.width / img.height;
            const targetRatio = targetWidth / targetHeight;
            
            if (sourceRatio > targetRatio) {
                dh = targetWidth / sourceRatio;
                dy = (targetHeight - dh) / 2;
            } else {
                dw = targetHeight * sourceRatio;
                dx = (targetWidth - dw) / 2;
            }
            
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, targetWidth, targetHeight);
        }
        
        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
        
        const processedImageDiv = document.getElementById('processedImage');
        const dataUrl = canvas.toDataURL('image/png');
        
        processedImageDiv.innerHTML = `
            <div class="mt-4 pt-4 border-t">
                <h4 class="font-semibold text-gray-900 mb-2">Processed Image</h4>
                <img src="${dataUrl}" class="max-w-full rounded border mb-3">
                <a href="${dataUrl}" download="sdxl_${targetWidth}x${targetHeight}.png" class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Download Image
                </a>
            </div>
        `;
    };
    
    img.src = image.data;
}

const SDXL_SUPPORTED_RESOLUTIONS = [
    [1024, 1024, 1.0],
    [1152, 896, 1.2857142857142858],
    [896, 1152, 0.7777777777777778],
    [1216, 832, 1.4615384615384615],
    [832, 1216, 0.6842105263157895],
    [1344, 768, 1.75],
    [768, 1344, 0.5714285714285714],
    [1536, 640, 2.4],
    [640, 1536, 0.4166666666666667],
];

const SDXL_EXTENDED_RESOLUTIONS = [
    [512, 2048, 0.25],
    [512, 1984, 0.26],
    [512, 1920, 0.27],
    [512, 1856, 0.28],
    [576, 1792, 0.32],
    [576, 1728, 0.33],
    [576, 1664, 0.35],
    [640, 1600, 0.4],
    [640, 1536, 0.42],
    [704, 1472, 0.48],
    [704, 1408, 0.5],
    [704, 1344, 0.52],
    [768, 1344, 0.57],
    [768, 1280, 0.6],
    [832, 1216, 0.68],
    [832, 1152, 0.72],
    [896, 1152, 0.78],
    [896, 1088, 0.82],
    [960, 1088, 0.88],
    [960, 1024, 0.94],
    [1024, 1024, 1.0],
    [1024, 960, 1.8],
    [1088, 960, 1.14],
    [1088, 896, 1.22],
    [1152, 896, 1.30],
    [1152, 832, 1.39],
    [1216, 832, 1.47],
    [1280, 768, 1.68],
    [1344, 768, 1.76],
    [1408, 704, 2.0],
    [1472, 704, 2.10],
    [1536, 640, 2.4],
    [1600, 640, 2.5],
    [1664, 576, 2.90],
    [1728, 576, 3.0],
    [1792, 576, 3.12],
    [1856, 512, 3.63],
    [1920, 512, 3.76],
    [1984, 512, 3.89],
    [2048, 512, 4.0],
];