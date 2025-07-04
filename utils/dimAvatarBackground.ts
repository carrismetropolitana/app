const dimAvatarBackground = (color: string) => {
        if (!color) return color;
        return color.replace(
            /rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/,
            (_, r, g, b, a) => {
                const alpha = parseFloat(a);
                const newAlpha = Math.max(0, Math.min(1, alpha * 0.4));
                return `rgba(${r}, ${g}, ${b}, ${newAlpha})`;
            }
        );
    }
export default dimAvatarBackground;