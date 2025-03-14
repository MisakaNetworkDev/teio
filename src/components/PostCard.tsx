import { Vibrant, WorkerPipeline } from "node-vibrant/worker";
import PipelineWorker from "node-vibrant/worker.worker?worker";
import { useState } from "react";
import clsx from 'clsx';
import { useIonRouter, useIonViewWillEnter } from "@ionic/react";

interface PostCardProps {
  tag?: string,
  title: string,
  desc?: string,
  id: string,
  cover: string,
  ai: boolean,
  className?: string,
}

const PostCard: React.FC<PostCardProps> = (props: PostCardProps) => {
  const [paletteColor, setPaletteColor] = useState<string>('');
  const [gradientStyle, setGradientStyle] = useState({});

  const ionRouter = useIonRouter();

  Vibrant.use(new WorkerPipeline(PipelineWorker as never));
  useIonViewWillEnter(() => {
    Vibrant.from(props.cover).getPalette().then(palette => {
      const color = palette.Muted?.hex ?? '#FFFFFF';
      setPaletteColor(color);
      setGradientStyle({
        background: `linear-gradient(to top, ${color}FF 36%, ${color}00 100%)`
      });
    });
  })

  const handleClick = () => {
    ionRouter.push(`/tabbed/article/${props.id}`, "forward");
  };

  return (
    <div className={clsx(
      "w-full bg-cover bg-center rounded-4xl drop-shadow-lg relative border-4 border-white",
      props.className
    )} style={{ backgroundImage: `url(${props.cover})`, borderColor: `${paletteColor}` }} onClick={handleClick}>
      <div
        className="absolute bottom-0 left-0 w-full h-72 rounded-b-3xl z-1 bg-linear-to-t"
        style={gradientStyle}
      />
      <div className="absolute bottom-6 left-0 w-full px-6 z-2">
        {
          props.tag && <span className="text-white/80 text-lg font-bold">{props.tag}</span>
        }
        <p className="text-3xl text-white font-bold line-clamp-2">{props.title}</p>
        {
          props.desc && <p className="text-white/80 text-lg font-bold line-clamp-1">{props.desc}</p>
        }
      </div>
      {props.ai &&
        <span
          className="absolute top-6 right-6 z-3 px-2 py-0.5 backdrop-blur-sm rounded-lg font-bold text-white"
          style={{ backgroundColor: `${paletteColor}99` }}
        >
          AI CUSTOMIZED
        </span>
      }
    </div>
  );
}

export default PostCard;