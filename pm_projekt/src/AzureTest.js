const { BlobServiceClient } = require("@azure/storage-blob"); // Azure SDK pre Blob Storage

const testAzureConnection = async () => {
  const accountName = "pmprojectstorage";  // Nahraďte názvom vášho účtu
  const sasToken = "sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-11-12T21:15:04Z&st=2024-11-12T13:15:04Z&spr=https&sig=ifisc748oWfuWdbbit3BNeftNzLuiuR2K6NOmXiijbU%3D";  // Nahraďte SAS tokenom pre prístup
  const containerName = "graph-expenses";  // Nahraďte názvom vášho kontajnera

  try {
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net?${sasToken}`
    );

    const containers = blobServiceClient.listContainers();
    
    let containerNames = [];
    for await (const container of containers) {
      containerNames.push(container.name);
    }

    if (containerNames.length > 0) {
      console.log("Úspešné pripojenie k Azure Storage!");
    } else {
      console.log("Kontajnery neboli nájdené.");
    }
  } catch (error) {
    console.error("Chyba pri pripojení k Azure:", error.message);
  }
};

// Zavoláme funkciu na testovanie pripojenia pri načítaní
testAzureConnection();
