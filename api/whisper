export default async function handler(req, res) {
  try {
    const { file } = req.query; // 支持从 URL 传入音频链接

    if (!file) {
      return res.status(400).json({ error: "Missing 'file' parameter" });
    }

    const formData = new FormData();
    const responseAudio = await fetch(file);
    const blob = await responseAudio.blob();
    formData.append("file", blob, "audio.mp3");
    formData.append("model", "whisper-large-v3-turbo");

    const response = await fetch("https://ai.gitee.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 1VXJAMOYNK8PPYZUA13XUAHUVG1QRBKYVVYIQQC0",
      },
      body: formData,
    });

    const result = await response.json();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
