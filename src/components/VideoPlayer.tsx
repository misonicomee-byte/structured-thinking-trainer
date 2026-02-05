export const VideoPlayer = () => {
  const videoUrl = `${import.meta.env.BASE_URL}training-video.mp4`;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-6">
      <h3 className="text-lg font-bold text-primary mb-3">
        📺 トレーニング動画
      </h3>
      <p className="text-sm text-gray-600 mb-3">
        構造化思考の基本を2分で学べる動画です
      </p>
      <video
        controls
        className="w-full rounded-lg"
        preload="metadata"
      >
        <source src={videoUrl} type="video/mp4" />
        お使いのブラウザは動画タグをサポートしていません。
      </video>
    </div>
  );
};
