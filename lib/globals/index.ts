export type TComponentType = 'messenger_button' | 'telegram_button' | 'whatsapp_button' | 'bracket' | 'announcements' | 'comparison_table' | 'before_after' | 'automatic_stories' | 'numbers_counter' | 'testimonials' | 'image_hotspot' | 'chart' | 'faq' | 'timeline' | 'audio_player' | 'pricing_table' | 'countdown_bar' | 'pdf_gallery' | 'feed' | 'business_hours' | 'logo_showcase';

export enum ServiceName {
  COMMONNINJA = 'commoninja',
  MESSENGERBUTTONNINJA = 'messengerbuttonninja',
  TELEGRAMBUTTONNINJA = 'telegrambuttonninja',
  WHATSAPPBUTTONNINJA = 'whatsappbuttonninja',
  BRACKETSNINJA = 'bracketsninja',
  ANNOUNCEMENTSNINJA = 'announcementsninja',
  COMPARENINJA = 'compareninja',
  BEFOREAFTERNINJA = 'beforeafterninja',
  AUTOSTORIESNINJA = 'autostoriesninja',
  NUMBERSCOUNTERNINJA = 'numberscounterninja',
  TESTIMONIALSNINJA = 'testimonialsninja',
  IMAGEHOTSPOTNINJA = 'imagehotspotninja',
  CHARTSNINJA = 'chartsninja',
  FAQNINJA = 'faqninja',
  TIMELINENINJA = 'timelineninja',
  AUDIOPLAYERNINJA = 'audioplayerninja',
  PRICERNINJA = 'pricerninja',
  COUNTDOWNBARNINJA = 'countdownbarninja',
  PDFEMBEDNINJA = 'pdfembedninja',
  FEEDERNINJA = 'feederninja',
  BUSINESSHOURSNINJA = 'businesshoursninja',
  LOGONINJA = 'logoninja'
}

export enum ServiceDisplayName {
  COMMONNINJA = 'Common Ninja',
  MESSENGERBUTTONNINJA = 'Messenger Chat Button',
  TELEGRAMBUTTONNINJA = 'Telegram Chat Button',
  WHATSAPPBUTTONNINJA = 'WhatsApp Chat Button',
  BRACKETSNINJA = 'Brackets & Tournaments',
  ANNOUNCEMENTSNINJA = 'Announcements & Changelog',
  COMPARENINJA = 'Comparison Tables',
  BEFOREAFTERNINJA = 'Before & After Slider',
  AUTOSTORIESNINJA = 'Stories',
  NUMBERSCOUNTERNINJA = 'Numbers Counter',
  TESTIMONIALSNINJA = 'Testimonials',
  IMAGEHOTSPOTNINJA = 'Image Hotspot',
  CHARTSNINJA = 'Charts & Graphs',
  FAQNINJA = 'FAQ',
  TIMELINENINJA = 'Timeline',
  AUDIOPLAYERNINJA = 'Audio Player',
  PRICERNINJA = 'Pricing Tables',
  COUNTDOWNBARNINJA = 'Countdown Bar',
  PDFEMBEDNINJA = 'PDF Gallery',
  FEEDERNINJA = 'Social Media & RSS Feeds',
  BUSINESSHOURSNINJA = 'Business Hours',
  LOGONINJA = 'Logo Showcase'
}

export enum Component {
  UNKNOWN = 'unknown',
  MESSENGER_BUTTON = 'messenger_button',
  TELEGRAM_BUTTON = 'telegram_button',
  WHATSAPP_BUTTON = 'whatsapp_button',
  BRACKET = 'bracket',
  ANNOUNCEMENTS = 'announcements',
  COMPARISON_TABLE = 'comparison_table',
  BEFORE_AFTER = 'before_after',
  AUTOMATIC_STORIES = 'automatic_stories',
  NUMBERS_COUNTER = 'numbers_counter',
  TESTIMONIALS = 'testimonials',
  IMAGE_HOTSPOT = 'image_hotspot',
  CHART = 'chart',
  FAQ = 'faq',
  TIMELINE = 'timeline',
  AUDIO_PLAYER = 'audio_player',
  PRICING_TABLE = 'pricing_table',
  COUNTDOWN_BAR = 'countdown_bar',
  PDF_GALLERY = 'pdf_gallery',
  FEED = 'feed',
  BUSINESS_HOURS = 'business_hours',
  LOGO_SHOWCASE = 'logo_showcase'
}

export const ComponentToServiceName = new Map<Component, ServiceName>([
  [Component.MESSENGER_BUTTON, ServiceName.MESSENGERBUTTONNINJA],
  [Component.TELEGRAM_BUTTON, ServiceName.TELEGRAMBUTTONNINJA],
  [Component.WHATSAPP_BUTTON, ServiceName.WHATSAPPBUTTONNINJA],
  [Component.BRACKET, ServiceName.BRACKETSNINJA],
  [Component.ANNOUNCEMENTS, ServiceName.ANNOUNCEMENTSNINJA],
  [Component.COMPARISON_TABLE, ServiceName.COMPARENINJA],
  [Component.BEFORE_AFTER, ServiceName.BEFOREAFTERNINJA],
  [Component.AUTOMATIC_STORIES, ServiceName.AUTOSTORIESNINJA],
  [Component.NUMBERS_COUNTER, ServiceName.NUMBERSCOUNTERNINJA],
  [Component.TESTIMONIALS, ServiceName.TESTIMONIALSNINJA],
  [Component.IMAGE_HOTSPOT, ServiceName.IMAGEHOTSPOTNINJA],
  [Component.CHART, ServiceName.CHARTSNINJA],
  [Component.FAQ, ServiceName.FAQNINJA],
  [Component.TIMELINE, ServiceName.TIMELINENINJA],
  [Component.AUDIO_PLAYER, ServiceName.AUDIOPLAYERNINJA],
  [Component.PRICING_TABLE, ServiceName.PRICERNINJA],
  [Component.COUNTDOWN_BAR, ServiceName.COUNTDOWNBARNINJA],
  [Component.PDF_GALLERY, ServiceName.PDFEMBEDNINJA],
  [Component.FEED, ServiceName.FEEDERNINJA],
  [Component.BUSINESS_HOURS, ServiceName.BUSINESSHOURSNINJA],
  [Component.LOGO_SHOWCASE, ServiceName.LOGONINJA]
]);

export const ServiceNameToComponent = new Map<ServiceName, Component>([
  [ServiceName.MESSENGERBUTTONNINJA, Component.MESSENGER_BUTTON],
  [ServiceName.TELEGRAMBUTTONNINJA, Component.TELEGRAM_BUTTON],
  [ServiceName.WHATSAPPBUTTONNINJA, Component.WHATSAPP_BUTTON],
  [ServiceName.BRACKETSNINJA, Component.BRACKET],
  [ServiceName.ANNOUNCEMENTSNINJA, Component.ANNOUNCEMENTS],
  [ServiceName.COMPARENINJA, Component.COMPARISON_TABLE],
  [ServiceName.BEFOREAFTERNINJA, Component.BEFORE_AFTER],
  [ServiceName.AUTOSTORIESNINJA, Component.AUTOMATIC_STORIES],
  [ServiceName.NUMBERSCOUNTERNINJA, Component.NUMBERS_COUNTER],
  [ServiceName.TESTIMONIALSNINJA, Component.TESTIMONIALS],
  [ServiceName.IMAGEHOTSPOTNINJA, Component.IMAGE_HOTSPOT],
  [ServiceName.CHARTSNINJA, Component.CHART],
  [ServiceName.FAQNINJA, Component.FAQ],
  [ServiceName.TIMELINENINJA, Component.TIMELINE],
  [ServiceName.AUDIOPLAYERNINJA, Component.AUDIO_PLAYER],
  [ServiceName.PRICERNINJA, Component.PRICING_TABLE],
  [ServiceName.COUNTDOWNBARNINJA, Component.COUNTDOWN_BAR],
  [ServiceName.PDFEMBEDNINJA, Component.PDF_GALLERY],
  [ServiceName.FEEDERNINJA, Component.FEED],
  [ServiceName.BUSINESSHOURSNINJA, Component.BUSINESS_HOURS],
  [ServiceName.LOGONINJA, Component.LOGO_SHOWCASE]
]);

export enum ServiceDiscovery {
  EMAIL       = 'https://commonninja-emails.herokuapp.com',
  COMPONENTS  = 'https://commonninja-components.herokuapp.com',
  RESOURCES   = 'https://commonninja-resources.herokuapp.com',
  USERS       = 'https://commonninja-users.herokuapp.com',
  PAYMENTS    = 'https://commonninja-payments.herokuapp.com',
  EXPORT      = 'https://commonninja-screenshots.herokuapp.com',
  WIX         = 'https://commonninja-wix.herokuapp.com',
  EVENTS      = 'https://commonninja-events.herokuapp.com',
  HEALTH      = 'https://commonninja-health.herokuapp.com',
}

export interface IPluginListing {
  name: TComponentType;
  displayName: string;
  iconClass: string;
  buttonText: string;
  slug: string;
  teaser: string;
  serviceName: string;
  priority: number;
  developerId: string;
  status: 'draft' | 'published' | 'deleted';
  iconPaths?: number;
  categories?: string[];
  ribbon?: string;
  helpCenterLink?: string;
  meta?: {
    hero: {
      imageUrl: string;
      pluginId?: string;
    },
    keyBenefits: {
      title: string;
      description: string;
      icon: string;
    }[];
    keyFeatures: {
      title: string;
      description: string;
      imageUrl: string;
    }[];
    faq: {
      question: string;
      answer: string;
    }[];
    seo: {
      title: string;
      description: string;
      keywords: string[];
      image?: string;
    }
  };
}

export const pluginsList: IPluginListing[] = [{"name":"messenger_button","displayName":"Messenger Chat Button","iconClass":"messenger-button","buttonText":"Create Messenger Chat Button","slug":"messenger-button","teaser":"Create Messenger Chat Button","serviceName":"messengerbuttonninja","priority":115,"developerId":"911cedfc-6680-41a3-90b5-98bc1ce25596","status":"draft","iconPaths":1,"categories":[],"ribbon":"","helpCenterLink":"","meta":{"keyBenefits":[{"title":"","description":"","icon":""}],"keyFeatures":[{"title":"","description":"","imageUrl":""}],"faq":[{"question":"","answer":""}]}},{"name":"telegram_button","displayName":"Telegram Chat Button","iconClass":"telegram-button","buttonText":"Create Telegram Chat Button","slug":"telegram-button","teaser":"Create Telegram Chat Button","serviceName":"telegrambuttonninja","priority":110,"developerId":"911cedfc-6680-41a3-90b5-98bc1ce25596","status":"draft","iconPaths":1,"categories":[],"ribbon":"","helpCenterLink":"","meta":{"keyBenefits":[{"title":"","description":"","icon":""}],"keyFeatures":[{"title":"","description":"","imageUrl":""}],"faq":[{"question":"","answer":""}]}},{"name":"whatsapp_button","displayName":"WhatsApp Chat Button","iconClass":"whatsapp-button","buttonText":"Create WhatsApp Chat Button","slug":"whatsapp-button","teaser":"Create WhatsApp Chat Button","serviceName":"whatsappbuttonninja","priority":100,"developerId":"911cedfc-6680-41a3-90b5-98bc1ce25596","status":"draft","iconPaths":1,"categories":[],"ribbon":"","helpCenterLink":"","meta":{"keyBenefits":[{"title":"","description":"","icon":""}],"keyFeatures":[{"title":"","description":"","imageUrl":""}],"faq":[{"question":"","answer":""}]}},{"name":"bracket","displayName":"Brackets & Tournaments","iconClass":"brackets","buttonText":"Create a Bracket","slug":"brackets","teaser":"Create brackets & tournaments and easily manage them online","serviceName":"bracketsninja","priority":100,"developerId":"911cedfc-6680-41a3-90b5-98bc1ce25596","status":"published","iconPaths":2,"categories":[],"ribbon":"","helpCenterLink":"https://help.commoninja.com/hc/en-us/sections/115001053233-Brackets-Tournaments","meta":{"keyBenefits":[{"title":"","description":"","icon":""}],"keyFeatures":[{"title":"","description":"","imageUrl":""}],"faq":[{"question":"","answer":""}]}},{"name":"announcements","displayName":"Announcements & Changelog","iconClass":"announcements","buttonText":"Create Announcements","slug":"announcements","teaser":"Create changelog & announcements widget for your website","serviceName":"announcementsninja","priority":90,"developerId":"911cedfc-6680-41a3-90b5-98bc1ce25596","status":"published","iconPaths":5,"categories":[],"ribbon":"","helpCenterLink":"https://help.commoninja.com/hc/en-us/sections/360005290057-Announcements-Changelog","meta":{"keyBenefits":[{"title":"","description":"","icon":""}],"keyFeatures":[{"title":"","description":"","imageUrl":""}],"faq":[{"question":"","answer":""}]}},{"name":"comparison_table","displayName":"Comparison Tables","iconClass":"compare-tables","buttonText":"Create a Table","slug":"comparison-tables","teaser":"Create professional comparison tables and add them easily to your website","serviceName":"compareninja","priority":70,"developerId":"911cedfc-6680-41a3-90b5-98bc1ce25596","status":"published","iconPaths":8,"categories":[],"ribbon":"","helpCenterLink":"https://help.commoninja.com/hc/en-us/sections/115001053253-Comparison-Tables","meta":{"keyBenefits":[{"title":"","description":"","icon":""}],"keyFeatures":[{"title":"","description":"","imageUrl":""}],"faq":[{"question":"","answer":""}]}},{"name":"before_after","displayName":"Before & After Slider","iconClass":"before-after","buttonText":"Create a Slider","slug":"before-after","teaser":"Easily create beautiful before & after sliders to your website","serviceName":"beforeafterninja","priority":65,"developerId":"911cedfc-6680-41a3-90b5-98bc1ce25596","status":"published","iconPaths":6,"categories":[],"ribbon":"","helpCenterLink":"https://help.commoninja.com/hc/en-us/sections/360005960117-Before-After-Slider","meta":{"keyBenefits":[{"title":"","description":"","icon":""}],"keyFeatures":[{"title":"","description":"","imageUrl":""}],"faq":[{"question":"","answer":""}]}},{"name":"automatic_stories","displayName":"Stories","iconClass":"automatic-stories","buttonText":"Create Stories","slug":"stories","teaser":"Highlight content that matters with stories for websites","serviceName":"autostoriesninja","priority":60,"developerId":"911cedfc-6680-41a3-90b5-98bc1ce25596","status":"published","iconPaths":4,"categories":[],"ribbon":"","helpCenterLink":"https://help.commoninja.com/hc/en-us/sections/360004912678-Stories","meta":{"keyBenefits":[{"title":"","description":"","icon":""}],"keyFeatures":[{"title":"","description":"","imageUrl":""}],"faq":[{"question":"","answer":""}]}},{"name":"numbers_counter","displayName":"Numbers Counter","iconClass":"numbers-counter","buttonText":"Create a Numbers Counter","slug":"numbers-counter","teaser":"Create a Numbers Counter","serviceName":"numberscounterninja","priority":52,"developerId":"911cedfc-6680-41a3-90b5-98bc1ce25596","status":"draft","iconPaths":1,"categories":[],"ribbon":"","helpCenterLink":"","meta":{"keyBenefits":[{"title":"","description":"","icon":""}],"keyFeatures":[{"title":"","description":"","imageUrl":""}],"faq":[{"question":"","answer":""}]}},{"name":"testimonials","displayName":"Testimonials","iconClass":"testimonials","buttonText":"Create Testimonials Widget","slug":"testimonials","teaser":"Create Testimonials Widget","serviceName":"testimonialsninja","priority":51,"developerId":"911cedfc-6680-41a3-90b5-98bc1ce25596","status":"draft","iconPaths":7,"categories":[],"ribbon":"","helpCenterLink":"","meta":{"keyBenefits":[{"title":"","description":"","icon":""}],"keyFeatures":[{"title":"","description":"","imageUrl":""}],"faq":[{"question":"","answer":""}]}},{"name":"image_hotspot","displayName":"Image Hotspot","iconClass":"image-hotspot","buttonText":"Create an Image Hotspot","slug":"image-hotspot","teaser":"The ultimate image hotspot widget for your website","serviceName":"imagehotspotninja","priority":50,"developerId":"e52449fc-17d1-4932-9b00-f068a5b6dc46","status":"published","iconPaths":5,"categories":[],"ribbon":"","helpCenterLink":"https://help.commoninja.com/hc/en-us/sections/4408743101713-Image-Hotspot","meta":{"keyBenefits":[{"title":"","description":"","icon":""}],"keyFeatures":[{"title":"","description":"","imageUrl":""}],"faq":[{"question":"","answer":""}]}},{"name":"chart","displayName":"Charts & Graphs","iconClass":"charts","buttonText":"Create a Chart","slug":"charts","teaser":"Create beautiful graphs & charts and easily add them to your website","serviceName":"chartsninja","priority":50,"developerId":"911cedfc-6680-41a3-90b5-98bc1ce25596","status":"published","iconPaths":2,"categories":[],"ribbon":"","helpCenterLink":"https://help.commoninja.com/hc/en-us/sections/115001046974-Charts-Graphs","meta":{"keyBenefits":[{"title":"","description":"","icon":""}],"keyFeatures":[{"title":"","description":"","imageUrl":""}],"faq":[{"question":"","answer":""}]}},{"name":"faq","displayName":"FAQ","iconClass":"faq","buttonText":"Create FAQ","slug":"faq","teaser":"Create professional FAQ widgets and easily add them to your website","serviceName":"faqninja","priority":40,"developerId":"911cedfc-6680-41a3-90b5-98bc1ce25596","status":"published","iconPaths":7,"categories":[],"ribbon":"","helpCenterLink":"https://help.commoninja.com/hc/en-us/sections/360004912658-FAQ","meta":{"keyBenefits":[{"title":"","description":"","icon":""}],"keyFeatures":[{"title":"","description":"","imageUrl":""}],"faq":[{"question":"","answer":""}]}},{"name":"timeline","displayName":"Timeline","iconClass":"timeline","buttonText":"Create a Timeline","slug":"timeline","teaser":"Create a Timeline","serviceName":"timelineninja","priority":35,"developerId":"911cedfc-6680-41a3-90b5-98bc1ce25596","status":"draft","iconPaths":1,"categories":[],"ribbon":"","helpCenterLink":"","meta":{"keyBenefits":[{"title":"","description":"","icon":""}],"keyFeatures":[{"title":"","description":"","imageUrl":""}],"faq":[{"question":"","answer":""}]}},{"name":"audio_player","displayName":"Audio Player","iconClass":"audio-player","buttonText":"Create an Audio Player","slug":"audio-player","teaser":"Create an Audio Player","serviceName":"audioplayerninja","priority":31,"developerId":"911cedfc-6680-41a3-90b5-98bc1ce25596","status":"draft","iconPaths":3,"categories":[],"ribbon":"","helpCenterLink":"","meta":{"keyBenefits":[{"title":"Promote Yourself","description":"Use this powerful tool to add your music, songs, podcasts, or other equally entertaining audio projects, make your projects accessible and reach a wider audience!","icon":""},{"title":"Enrich Your Content","description":"Add more variety to your content and cater to the different needs of your audience. Add read-along for children to follow stories, create podcasts, or add accompanying music to your stories. ","icon":""},{"title":"Improve User Experience","description":"You can improve your users’ experience by making certain audio files available. You can, for example, create audio versions of your well-researched, highly informative, and exceptionally entertaining text, upload it via the app and allow visually impaired users to enjoy it. Or, make it available for those who are on the go and can’t sit and read your long text.","icon":""}],"keyFeatures":[{"title":"Multiple Audio Sources","description":"The app features the ability to add audio from various sources — be it MP3 or links to audio and video hosting websites like YouTube, Vimeo, SoundCloud and more!","imageUrl":"https://img.thedailybeast.com/image/upload/v1625794371/210708-beale-trejo-tease_ioadti.jpg"},{"title":"Shuffle","description":"The app comes with the shuffle option that will enable your users to listen to your audio in random order.","imageUrl":"https://variety.com/wp-content/uploads/2020/07/inmate-1-danny-trejo.jpg"},{"title":"Playlist View","description":"The app features the ability to toggle and custom the playlist view. You can customize the playlist and make it complement your style, or, alternatively, use the minimal version to create an aesthetic experience. ","imageUrl":"https://media-exp1.licdn.com/dms/image/C5603AQG3Sbj0ovAutQ/profile-displayphoto-shrink_800_800/0/1628494662469?e=1643846400&v=beta&t=h4DZRNs-FpojAR5uiDFLDfS-IX3t_6f_ph739z88vCg"},{"title":"Multiple Layouts","description":"The app features several layouts for you to choose from from a mini-player, to an enlarged thumbnail — choose what’s best for you!","imageUrl":"https://media.npr.org/assets/img/2014/08/01/ap101021130139_wide-95acf73acc2fa5941eddd9459359204ccfd597d6.jpg?s=1400"},{"title":"Position","description":"You can easily change the position of the Audio Player via the position option. Inline? Top right? Bottom left? Really, the choice is yours.","imageUrl":"https://d1nslcd7m2225b.cloudfront.net/Pictures/1024x536/3/6/0/1122360_Machete.jpg"},{"title":"Multiple Skins","description":"The app comes with a variety of beautiful skins that you can choose from so you don’t have to spend much time on extensive customization.","imageUrl":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHbkGBpjk1VK7ALm6T2XaS8d3BCC2sEB7jdg&usqp=CAU"}],"faq":[{"question":"Can I link to any audio file?","answer":"Yes, you can."},{"question":"Can I upload any audio file?","answer":"Yes, so long as the size does not exceed 10MB."},{"question":"Can I change the layout style?","answer":"Yes, you can easily do so from within the “Look & Feel” tab on your dashboard."},{"question":"Can I change the audio player’s position?","answer":"Yes, you can easily do so from within the “Look & Feel” tab on your dashboard."},{"question":"Can I change the audio player’s skin?","answer":"Yes, you can easily do so from within the “Look & Feel” tab on your dashboard."},{"question":"Can toggle the shuffle button on or off?","answer":"Yes, you can easily do so from within the “Settings” tab on your dashboard."},{"question":"Can I toggle the playlist’s song image on or off?","answer":"Yes, you can easily do so from within the “Settings” tab on your dashboard"},{"question":"Can I toggle the player’s time on or off?","answer":"Yes, you can easily do so from within the “Settings” tab on your dashboard."},{"question":"Can I toggle the playlist’s time on or off?","answer":"Yes, you can easily do so from within the “Settings” tab on your dashboard."},{"question":"Can I toggle the playlist’s time on or off?","answer":"Yes, you can easily do so from within the “Settings” tab on your dashboard."}]}},{"name":"pricing_table","displayName":"Pricing Tables","iconClass":"pricing-tables","buttonText":"Create a Table","slug":"pricing-tables","teaser":"Create responsive pricing tables for Your website on-the-fly","serviceName":"pricerninja","priority":30,"developerId":"911cedfc-6680-41a3-90b5-98bc1ce25596","status":"published","iconPaths":6,"categories":[],"ribbon":"","helpCenterLink":"https://help.commoninja.com/hc/en-us/sections/115001053213--Pricing-Tables","meta":{"keyBenefits":[{"title":"","description":"","icon":""}],"keyFeatures":[{"title":"","description":"","imageUrl":""}],"faq":[{"question":"","answer":""}]}},{"name":"countdown_bar","displayName":"Countdown Bar","iconClass":"countdown-bar","buttonText":"Create Countdown Bar","slug":"countdown-bar","teaser":"Easily create & add beautiful countdown bar to your website","serviceName":"countdownbarninja","priority":25,"developerId":"911cedfc-6680-41a3-90b5-98bc1ce25596","status":"published","iconPaths":6,"categories":[],"ribbon":"","helpCenterLink":"https://help.commoninja.com/hc/en-us/sections/4402846881425-Countdown-Promo-Bar","meta":{"keyBenefits":[{"title":"","description":"","icon":""}],"keyFeatures":[{"title":"","description":"","imageUrl":""}],"faq":[{"question":"","answer":""}]}},{"name":"pdf_gallery","displayName":"PDF Gallery","iconClass":"pdf-gallery","buttonText":"Create PDF Gallery","slug":"pdf-gallery","teaser":"Embed and View PDF files on any Website","serviceName":"pdfembedninja","priority":22,"developerId":"1d768d9b-246d-45a6-9183-150e7d5d5113","status":"published","iconPaths":8,"categories":[],"ribbon":"","helpCenterLink":"https://help.commoninja.com/hc/en-us/sections/4408021360529-PDF-Gallery","meta":{"keyBenefits":[{"title":"","description":"","icon":""}],"keyFeatures":[{"title":"","description":"","imageUrl":""}],"faq":[{"question":"","answer":""}]}},{"name":"feed","displayName":"Social Media & RSS Feeds","iconClass":"social-feeds","buttonText":"Create a Feed","slug":"feeds","teaser":"Create beautiful RSS & social feeds and easily add them to any website","serviceName":"feederninja","priority":20,"developerId":"911cedfc-6680-41a3-90b5-98bc1ce25596","status":"published","iconPaths":9,"categories":[],"ribbon":"","helpCenterLink":"https://help.commoninja.com/hc/en-us/sections/115001053193-RSS-Social-Media-Feeds","meta":{"keyBenefits":[{"title":"","description":"","icon":""}],"keyFeatures":[{"title":"","description":"","imageUrl":""}],"faq":[{"question":"","answer":""}]}},{"name":"business_hours","displayName":"Business Hours","iconClass":"business-hours","buttonText":"Create Business Hours Widget","slug":"business-hours","teaser":"Create Business Hours Widget","serviceName":"businesshoursninja","priority":13,"developerId":"911cedfc-6680-41a3-90b5-98bc1ce25596","status":"draft","iconPaths":1,"categories":[],"ribbon":"","helpCenterLink":"","meta":{"keyBenefits":[{"title":"","description":"","icon":""}],"keyFeatures":[{"title":"","description":"","imageUrl":""}],"faq":[{"question":"","answer":""}]}},{"name":"logo_showcase","displayName":"Logo Showcase","iconClass":"logo-showcase","buttonText":"Create a Logo Showcase","slug":"logo-showcase","teaser":"Create logo showcase","serviceName":"logoninja","priority":12,"developerId":"f739f6d5-bc10-4347-a8a2-5daed215125b","status":"published","iconPaths":7,"categories":[],"ribbon":"","helpCenterLink":"https://help.commoninja.com/hc/en-us/sections/4408734899473-Logo-Showcase","meta":{"keyBenefits":[{"title":"","description":"","icon":""}],"keyFeatures":[{"title":"","description":"","imageUrl":""}],"faq":[{"question":"","answer":""}]}}] as IPluginListing[];