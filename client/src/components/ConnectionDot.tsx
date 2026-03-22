interface Props {
  connected: boolean;
}

export default function ConnectionDot({ connected }: Props) {
  return (
    <span className="flex items-center gap-1 text-sm">
      <span
        className={`inline-block w-2.5 h-2.5 rounded-full ${
          connected ? 'bg-emerald-400' : 'bg-red-500 animate-pulse'
        }`}
      />
      <span className={connected ? 'text-emerald-400' : 'text-red-400'}>
        {connected ? 'Live' : '切断中'}
      </span>
    </span>
  );
}
