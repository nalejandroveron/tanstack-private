type AvatarProps = { alt: string; className: string } & (
  | { src: string }
  | { name: string }
);

export function Avatar(props: AvatarProps) {
  return (
    <div className={props.className}>
      {'src' in props ? (
        <img
          alt={props.alt}
          src={props.src}
          className="w-full h-full rounded-full"
        />
      ) : (
        <div className="w-full h-full font-bold select-none rounded-full bg-zinc-400 text-zinc-950 flex items-center justify-center">
          {props.name
            .split(' ')
            .map((part) => part.charAt(0))
            .join('')}
        </div>
      )}
    </div>
  );
}
