
import { useState, useEffect } from 'react';

export default function useDpadNavigation(itemCount) {
    const [focusIndex, setFocusIndex] = useState(0);

    useEffect(() => {
        const onKey = (e) => {
            switch (e.key) {
                case 'ArrowRight':
                    setFocusIndex((i) => Math.min(i + 1, itemCount - 1));
                    setTimeout(() => {
                        document.querySelectorAll('.live-item')[focusIndex]?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }, 50);
                    break;
                case 'ArrowLeft':
                    setFocusIndex((i) => Math.max(i - 1, 0));
                    setTimeout(() => {
                        document.querySelectorAll('.live-item')[focusIndex]?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }, 50);
                    break;
                case 'Enter':
                    document.querySelectorAll('.live-item')[focusIndex]?.click();
                    break;
                case 'Backspace':
                case 'Escape':
                    window.history.back();
                    break;
                case 'h':
                case 'H':
                    window.location.href = '/';
                    break;
                default:
                    break;
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [focusIndex, itemCount]);

    return focusIndex;
}
