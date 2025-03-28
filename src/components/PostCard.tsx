import { Vibrant, WorkerPipeline } from "node-vibrant/worker";
import PipelineWorker from "node-vibrant/worker.worker?worker";
import { useEffect, useState } from "react";
import clsx from 'clsx';
import { useIonRouter } from "@ionic/react";

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
  const [mutedColor, setMutedColor] = useState<string>('');
  const [gradientStyle, setGradientStyle] = useState({});

  const ionRouter = useIonRouter();

  Vibrant.use(new WorkerPipeline(PipelineWorker as never));
  useEffect(() => {
    Vibrant.from(props.cover).getPalette().then(palette => {
      const mutedColor = palette.Muted?.hex ?? '#FFFFFF';
      setMutedColor(mutedColor);
      setGradientStyle({
        background: `linear-gradient(to top, ${mutedColor}FF 36%, ${mutedColor}00 100%)`
      });
    });
  }, [props.cover])

  const handleClick = () => {
    if (props.ai) {
      ionRouter.push(`/tabbed/ai-article/${props.id}`, "forward");
    } else {
      ionRouter.push(`/tabbed/article/${props.id}`, "forward");
    }
  };

  return (
    <div className={clsx(
      "w-full bg-cover bg-center rounded-4xl drop-shadow-lg relative border-4 border-black transition-colors",
      props.className
    )} style={{ backgroundImage: `url(${props.cover})`, borderColor: `${mutedColor}` }} onClick={handleClick}>
      <div
        className="absolute bottom-0 left-0 w-full h-72 rounded-b-3xl z-1 bg-linear-to-t from-black to-transparent"
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
          style={{ backgroundColor: `${mutedColor}99` }}
        >
          AI CUSTOMIZED
        </span>
      }
    </div>
  );
}

export default PostCard;