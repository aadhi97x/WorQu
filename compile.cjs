const fs = require('fs');
const path = require('path');
const solc = require('solc');

function findImports(importPath) {
    let resolvedPath;
    if (importPath.startsWith('@openzeppelin/')) {
        resolvedPath = path.resolve(__dirname, 'node_modules', importPath);
    } else {
        resolvedPath = path.resolve(__dirname, 'contracts', importPath);
    }

    try {
        return {
            contents: fs.readFileSync(resolvedPath, 'utf8')
        };
    } catch (e) {
        return { error: 'File not found: ' + resolvedPath };
    }
}

const escrowSource = fs.readFileSync(path.resolve(__dirname, 'contracts', 'JobEscrow.sol'), 'utf8');
const nftSource = fs.readFileSync(path.resolve(__dirname, 'contracts', 'WorkAgreementNFT.sol'), 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'JobEscrow.sol': {
            content: escrowSource
        },
        'WorkAgreementNFT.sol': {
            content: nftSource
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['abi', 'evm.bytecode.object']
            }
        }
    }
};

console.log('Compiling contracts...');
const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

if (output.errors) {
    let hasError = false;
    output.errors.forEach(err => {
        console.error(err.formattedMessage);
        if (err.severity === 'error') hasError = true;
    });
    if (hasError) process.exit(1);
}

const escrowData = output.contracts['JobEscrow.sol']['JobEscrow'];
const nftData = output.contracts['WorkAgreementNFT.sol']['WorkAgreementNFT'];

const escrowOutput = {
    abi: escrowData.abi,
    bytecode: escrowData.evm.bytecode.object
};

const nftOutput = {
    abi: nftData.abi,
    bytecode: nftData.evm.bytecode.object
};

fs.mkdirSync(path.resolve(__dirname, 'public', 'artifacts'), { recursive: true });
fs.writeFileSync(path.resolve(__dirname, 'public', 'artifacts', 'JobEscrow.json'), JSON.stringify(escrowOutput, null, 2));
fs.writeFileSync(path.resolve(__dirname, 'public', 'artifacts', 'WorkAgreementNFT.json'), JSON.stringify(nftOutput, null, 2));

console.log('Successfully wrote artifacts to public/artifacts!');
