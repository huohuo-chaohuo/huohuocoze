export default async function handler(req, res) {
  try {
    const { file } = req.query;
    if (!file) {
      return res.status(400).json({ error: "Missing 'file' parameter" });
    }

    // 拉取音频文件
    const responseAudio = await fetch(file);
    if (!responseAudio.ok) {
      throw new Error(`Failed to fetch audio: ${responseAudio.statusText}`);
    }

    // 构建 formData
    const formData = new FormData();
    const blob = await responseAudio.blob();
    formData.append("file", blob, "audio.mp3");
    formData.append("model", "whisper-large-v3-turbo");

    // 调用 Whisper API
    const response = await fetch("https://ai.gitee.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: "Bearer 你的Gitee API密钥",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Whisper API failed: ${response.statusText}`);
    }

    const result = await response.json();
    res.status(200).json({
      text: result.text,
      language: result.language,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
