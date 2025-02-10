const { SESClient, ListTemplatesCommand, GetTemplateCommand, CreateTemplateCommand } = require('@aws-sdk/client-ses');



const sesClient = new SESClient({
    region: "ap-south-1",
    credentials: {
      accessKeyId: "AKIA4MTWKGIBFXNSFBKQ", //process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: "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", //process.env.AWS_ACCESS_SECRET,
    },
  });

  const listTemplates = async () => {
    try {
      const command = new ListTemplatesCommand({});
      const response = await sesClient.send(command);
      return response.TemplatesMetadata;
    } catch (err) {
      console.error("Error listing templates:", err);
      return [];
    }
  };


const getTemplateDetails = async (templateName) => {
    try {
      const command = new GetTemplateCommand({ TemplateName: templateName });
      const response = await sesClient.send(command);
      return response.Template;
    } catch (err) {
      console.error(`Error getting template details for ${templateName}:`, err);
      return null;
    }
  };

   //  getTemplateDetails("sendOtp").then((res) => {
   //      console.log(res)
   //  });