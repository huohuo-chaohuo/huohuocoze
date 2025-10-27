export default async function handler(req, res) {
  try {
    const { file } = req.query;
    if (!file) {
      return res.status(400).json({ error: "Missing 'file' parameter" });
    }

    // 从外部链接下载音频（伪装成浏览器）
    const audioResp = await fetch(file, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "*/*",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Referer": "https://www.aliyun.com/",
        "Origin": "https://www.aliyun.com",
      },
    });

    if (!audioResp.ok) {
      throw new Error(`Failed to fetch audio: ${audioResp.status}`);
    }

    // 转成 blob 上传给 Whisper
    const blob = await audioResp.blob();
    const formData = new FormData();
    formData.append("file", blob, "audio.mp3");
    formData.append("model", "whisper-large-v3-turbo");

    const whisperResp = await fetch("https://ai.gitee.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: "Bearer 你的GiteeAPIKey", // ← 换成你自己的 key
      },
      body: formData,
    });

    const result = await whisperResp.json();
    return res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
