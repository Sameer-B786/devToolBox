import React, { useEffect } from 'react';

declare global {
    interface Window {
        adsbygoogle: any;
    }
}

interface GoogleAdProps {
    client: string;
    slot: string;
    style?: React.CSSProperties;
    format?: string;
    responsive?: string;
}

const GoogleAd: React.FC<GoogleAdProps> = ({ client, slot, style, format, responsive }) => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, [client, slot, style, format, responsive]);

    // Placeholder view for when the ad doesn't load or in development
    if (client === "ca-pub-XXXXXXXXXXXXXXXX") {
        return (
            <div className="text-center text-gray-500 bg-gray-200 w-full py-10">
                Advertisement Placeholder
            </div>
        );
    }
    
    return (
        <ins
            className="adsbygoogle"
            style={style}
            data-ad-client={client}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive={responsive}
        ></ins>
    );
};

export default GoogleAd;