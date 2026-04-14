const forge = require('node-forge');
const fs = require('fs');
const path = require('path');

/**
 * 生成并保存自签名证书与私钥
 * @param {string} keyPath 私钥保存的绝对或相对路径
 * @param {string} certPath 证书保存的绝对或相对路径
 * @param {string} cn 证书绑定的通用名称 (Common Name)
 */
function createSelfSignedCert(keyPath, certPath, cn = '127.0.0.1') {
    // 生成2048位的RSA密钥对
    const keys = forge.pki.rsa.generateKeyPair(2048);

    // 创建X.509证书对象
    const cert = forge.pki.createCertificate();
    
    // 设置公钥
    cert.publicKey = keys.publicKey;
    
    // 设置证书序列号
    cert.serialNumber = '1000';
    
    // 设置证书有效期 (当前时间至10年后)
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 10);

    // 配置证书的主题和颁发者信息 (O和OU为Moonlight)
    const attrs = [
        { name: 'countryName', value: 'UK' },
        { shortName: 'ST', value: 'London' },
        { name: 'localityName', value: 'London' },
        { name: 'organizationName', value: 'Moonlight' },
        { shortName: 'OU', value: 'Moonlight' },
        { name: 'commonName', value: cn }
    ];
    
    cert.setSubject(attrs);
    cert.setIssuer(attrs);

    // 使用私钥和SHA-256算法对证书进行签名
    cert.sign(keys.privateKey, forge.md.sha256.create());

    // 将证书和私钥转换为PEM格式的字符串
    const pemCert = forge.pki.certificateToPem(cert);
    const pemKey = forge.pki.privateKeyToPem(keys.privateKey);

    // 写入文件系统
    fs.writeFileSync(certPath, pemCert);
    fs.writeFileSync(keyPath, pemKey);
    
    console.log(`证书生成成功:\n  私钥: ${keyPath}\n  证书: ${certPath}\n  CN: ${cn}`);
}

// 确保证书保存目录存在
const serverDir = path.join(__dirname, 'server');
if (!fs.existsSync(serverDir)) {
    fs.mkdirSync(serverDir, { recursive: true });
}

// 定义私钥和证书的输出路径
const keyPath = path.join(serverDir, 'key.pem');
const certPath = path.join(serverDir, 'cert.pem');

// 允许通过命令行参数自定义CN，否则默认使用127.0.0.1
const cn = process.argv[2] || '127.0.0.1';

// 调用生成函数
createSelfSignedCert(keyPath, certPath, cn);
