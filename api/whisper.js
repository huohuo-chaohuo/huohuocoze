export default async function handler(req, res) {
  try {
    const { file } = req.query; // 获取 ?file= 参数
    if (!file) {
      return res.status(400).json({ error: "Missing 'file' parameter" });
    }

    // 尝试抓取文件
    const responseAudio = await fetch(file);
    if (!responseAudio.ok) {
      return res.status(400).json({ error: "Cannot fetch the file. Please check URL." });
    }

    // 检查文件类型
    const contentType = responseAudio.headers.get("content-type") || "";
    if (!contentType.startsWith("audio/")) {
      return res.status(400).json({ error: `Invalid file type: ${contentType}` });
    }

    // 构造表单
    const formData = new FormData();
    const blob = await responseAudio.blob();
    formData.append("file", blob, "audio.mp3");
    formData.append("model", "whisper-large-v3-turbo");

    // 调用 Gitee Whisper API
    const response = await fetch("https://ai.gitee.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: "Bearer 1VXJAMOYNK8PPYZUA13XUAHUVG1QRBKYVVYIQQC0",
      },
      body: formData,
    });

    const result = await response.json();
if (!response.ok) {
  return res.status(response.status).json({ error: result.error || "Transcription failed" });
}
res.status(200).json({
  text: result.text || "(empty result)",
  language: result.language || "unknown"
});
  }
}
