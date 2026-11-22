import { useThree } from "@react-three/fiber";

// Narrow (portrait) viewports get a smaller crystal and a farther camera so nothing is cropped.
export function useFit() {
  const { width, height } = useThree((s) => s.size);
  return Math.min(1, (width / height) * 1.3);
}
