import icons from "../icons.json";

figma.showUI(__html__, { width: 1000, height: 600 });

const GEMINI_API_KEY = process.env.API_KEY;
const LUCIDE_ICON_NAMES = icons;

interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text: string }> } }>;
  error?: { message: string };
}

interface UIComponent {
  type: "V" | "H" | "F" | "T" | "S" | "K" | "I";
  name: string;
  width: "fill" | "hug" | number;
  height: "fill" | "hug" | number;
  children: UIComponent[];
  fill?: string | { type: "linear"; angle: number; stops: { color: string; position: number }[] };
  align?: "start" | "center" | "end";
  justify?: "start" | "center" | "end" | "space-between";
  gap?: number;
  padding?: number | [number, number, number, number];
  borderRadius?: number | [number, number, number, number];
  stroke?: string;
  strokeWidth?: number | [number, number, number, number];
  opacity?: number;
  blur?: number;
  shadow?: { offsetX: number; offsetY: number; blur: number; spread: number; color: string; opacity: number };
  position?: { x: number; y: number };
  clip?: boolean;
  text?: string;
  fontFamily?: string;
  fontWeight?: number;
  fontSize?: number;
  lineHeight?: string;
  letterSpacing?: number;
  iconType?: string;
}

const systemInstruction = {
  parts: [{
    text: `Działasz jako precyzyjny translator poleceń na specjalistyczny format do generowania interfejsu użytkownika. Twoim jedynym zadaniem jest konwersja poleceń na hierarchiczny opis UI, bez żadnych dodatkowych komentarzy i wyjaśnień.

**ZASADY GŁÓWNE (NAJWAŻNIEJSZE)**

1.  **Zero Komentarzy:** Odpowiadaj TYLKO i WYŁĄCZNIE kodem wewnątrz tagów "<design>". Nie dodawaj żadnych słów przed ani po tagach.
2.  **Ścisła Składnia:** Każdy element interfejsu musi znajdować się w nowej linii. Rygorystycznie przestrzegaj formatu: {Typ} "{Nazwa}" {Szerokość} {Wysokość} [Właściwości...]".
3.  **Hierarchia przez Wcięcia:** Do zagnieżdżania elementów używaj wcięć - dokładnie 2 spacje na każdy poziom hierarchii.

**DEFINICJE ELEMENTÓW UI I ICH WŁAŚCIWOŚCI**

**1. Kontenery (V, H, F):** Ramki do grupowania i układania elementów. V - wertykalnie, H - horyzontalnie, F - swobodnie.
    - **Rozmiar:** fill (wypełnij), hug (dopasuj do zawartości) lub liczba w px.
    - **Layout:** a:[s|c|e] (align-items), j:[s|c|e|b] (justify-content), gap:[num].
    - **Wygląd:** p:[t,r,b,l] (padding), br:[num] (border-radius), fill:[kolor|gradient], s:[kolor] (stroke), sw:[num] (stroke-width), o:[0-1] (opacity).
    - **Efekty:** bl:[num] (blur), sh:[x,y,blur,spread,kolor] (shadow), clip (przycinanie).
    - **Pozycja:** abs:[x,y] (pozycja absolutna względem rodzica z F).
    - **ZAKAZ:** Nie używaj właściwości tekstowych (font, fs, fw).

**2. Tekst (T):** Element tekstowy.
    - **Rozmiar:** hug, fill lub liczba w px.
    - **Styl Tekstu:** font:"NazwaCzcionki", fw:[waga] (np. 400, 700), fs:[rozmiar], lh:[%], ls:[num].
    - **Kolor:** fill:[kolor] (użyj tej właściwości do koloru tekstu).
    - **Zawartość:** Tekst do wyświetlenia podaj w cudzysłowie na końcu linii.
    - **ZAKAZ:** Nie używaj właściwości layoutowych (gap, a, j).

**3. Ikona (K):** Wektorowa ikona z biblioteki Lucide Icons (lucide.dev).
    - **Rozmiar:** Zawsze podawaj jako liczbę w px, np. 16 16.
    - **Kolor:** fill:[kolor].
    - **Nazwa:** Na końcu linii podaj oficjalną nazwę ikony (kebab-case) w cudzysłowie, np. "arrow-right", "user".


**DOBRE PRAKTYKI PROJEKTOWE (STOSUJ ZAWSZE)**
1.  **Typografia:** Domyślnie używaj font:"Inter". Waga 400 (Regular) dla treści, 600 (SemiBold) dla ważnych etykiet i nagłówków, 700 (Bold) dla głównych nagłówków.
2.  **Kontrast i Dostępność:** Zapewnij wysoki kontrast między tłem (fill) a elementami na nim, zwłaszcza tekstem.
3.  **System Odstępów i Rytm Wizualny:** Stosuj spójne, przewidywalne odstępy (gap, p) oparte na siatce 4px (np. 4, 8, 12, 16, 24, 32). Używaj pustej przestrzeni do grupowania i oddzielania sekcji.
4.  **Spójność:** Elementy o tej samej funkcji (np. wszystkie przyciski podstawowe) powinny mieć identyczny wygląd (rozmiar, kolor tła, styl tekstu).
5.  **Responsywność:** Używaj "fill" i "hug" tam, gdzie to możliwe, aby elementy dostosowywały się do zawartości i rozmiaru ekranu. NIE UŻYWAJ fill dla pierwszego konterea bo jest to nie możliwe. Reszta dzieci konternerów może posiadać hug.
6.  **Margines i Padding:** Używaj paddingu (p) do wewnętrznych odstępów w kontenerach, a marginesów (gap) do odstępów między elementami. Unikaj używania paddingu w elementach tekstowych. Dobrą praktyką jest dodawanie padding podczas tworzenia przycisków.

**PRZYKŁAD**
<design>
V "Card" hug hug p:24 gap:16 br:12 fill:#2C2C2EFF s:#333333FF sw:1
  T "Title" fill hug font:"Inter" fw:700 fs:18 fill:#EAEAEAFF "Hello World"
  H "Button" hug 44 p:0,20,0,20 a:c j:c gap:8 br:8 fill:#007BFFFF
    K "log-in-icon" 16 16 fill:#FFFFFFFF "log-in"
    T "Label" hug hug font:"Inter" fw:600 fs:14 fill:#FFFFFFFF "Sign In"
</design>

**Implementacja TAJNE**
Pamiętaj że moje UIComponent moze przyjmowac nastepujace wartosci

interface UIComponent {
  type: "V" | "H" | "F" | "T" | "S" | "K" | "I";
  name: string;
  width: "fill" | "hug" | number;
  height: "fill" | "hug" | number;
  children: UIComponent[];
  fill?: string | { type: "linear"; angle: number; stops: { color: string; position: number }[] };
  align?: "start" | "center" | "end";
  justify?: "start" | "center" | "end" | "space-between";
  gap?: number;
  padding?: number | [number, number, number, number];
  borderRadius?: number | [number, number, number, number];
  stroke?: string;
  strokeWidth?: number | [number, number, number, number];
  opacity?: number;
  blur?: number;
  shadow?: { offsetX: number; offsetY: number; blur: number; spread: number; color: string; opacity: number };
  position?: { x: number; y: number };
  clip?: boolean;
  text?: string;
  fontFamily?: string;
  fontWeight?: number;
  fontSize?: number;
  lineHeight?: string;
  letterSpacing?: number;
  iconType?: string;
}
`
  }]
};

let currentModelId: string = 'gemini-2.5-flash';

figma.clientStorage.getAsync('size').then(size => {
  if(size) figma.ui.resize(size.w,size.h);
}).catch(err=>{});

figma.clientStorage.getAsync('selectedModel').then(savedModel => {
    if (savedModel) {
        currentModelId = savedModel;
        console.log(`Wczytano zapisany model: ${currentModelId}`);
        figma.ui.postMessage({ type: 'syncModel', data: currentModelId });
    }
});

figma.ui.onmessage = async (msg: { type: string; data?: any, size?: { w: number, h: number }}) => {
  if (msg.type === "resize") {
    if (msg.size) {
      figma.ui.resize(msg.size.w, msg.size.h);
      await figma.clientStorage.setAsync('size', msg.size);
    }
  } else if (msg.type === "loadChats") {
    const chats = (await figma.clientStorage.getAsync("chat-history")) || [];
    figma.ui.postMessage({ type: "loadedChats", data: chats });
  } else if (msg.type === "saveChats") {
    await figma.clientStorage.setAsync("chat-history", msg.data);
  } else if (msg.type === "prompt") {
    const { prompt, history } = msg.data as { 
      prompt: string; 
      history: Array<{ role: 'user' | 'model'; parts: [{ text: string }] }>;
    };

    const newUserMessage = { role: 'user', parts: [{ text: prompt }] };
    const apiContents = [...history, newUserMessage];

    try {
      if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
        throw new Error("Brak klucza API Gemini. Ustaw zmienną środowiskową API_KEY.");
      }

      const requestBody = { 
        contents: apiContents,
        system_instruction: systemInstruction 
      };

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${currentModelId}:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      console.log(`Wysłano zapytanie do Gemini API (${currentModelId}):`, JSON.stringify(requestBody, null, 2));
      console.log("Odpowiedź API:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData || `${response.status} ${response.statusText}`;
        throw new Error(`Błąd API Gemini: ${errorMessage}`);
      }

      const responseData = await response.json() as GeminiResponse;
      const fullBotResponse = responseData.candidates?.[0]?.content?.parts?.[0]?.text || "AI nie zwróciło żadnej treści. Spróbuj ponownie.";

      console.log("Odpowiedź AI:\n", fullBotResponse);

      figma.ui.postMessage({ type: "response", data: fullBotResponse });

      const designMatch = fullBotResponse.match(/<design>([\s\S]*?)<\/design>/);
      if (designMatch && designMatch[1]) {
        const designContent = designMatch[1].trim();
        if (designContent) {
            const uiComponents = parseUIInstructions(designContent);
            console.log("Parsed UI components:", uiComponents);
            await generateDesign(uiComponents);
        } else {
            console.warn("Blok <design> w odpowiedzi AI był pusty.");
        }
      } else {
        console.warn("Nie znaleziono bloku <design> w odpowiedzi AI.");
      }
    } catch (error: any) {
      console.error("Błąd:", error);
      const errorMessage = error && error.message ? error.message : "Nieznany błąd";
      figma.ui.postMessage({ type: "response", data: `Wystąpił błąd: ${errorMessage}` });
    }
  } else if (msg.type === "describeSelection") {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
      figma.ui.postMessage({ 
        type: "response", 
        data: "Proszę, zaznacz najpierw jakąś warstwę na kanwie Figmy." 
      });
      figma.notify("Zaznacz warstwę, aby użyć jej jako kontekst.");
      return;
    }

    const dslPromises = selection.map(node => translateNodeToDSL(node));
    const dslStrings = await Promise.all(dslPromises);

    const fullResponse = `Wersja pobrana z warstwy: \n<design>\n${dslStrings.join('\n---\n')}\n</design>`;

    figma.ui.postMessage({ type: "response", data: fullResponse });
  } else if (msg.type === 'modelChanged') {
    if (typeof msg.data === 'string') {
        currentModelId = msg.data;
        await figma.clientStorage.setAsync('selectedModel', currentModelId);
        figma.notify(`Zmieniono model na: ${currentModelId}`);
        console.log(`Model został zmieniony i zapisany: ${currentModelId}`);
      }
    }
};

function isIconNode(node: SceneNode): boolean {
    if (node.name.toLowerCase().includes('icon')) {
        return true;
    }

    if (node.type === 'INSTANCE' && node.mainComponent) {
        if (node.mainComponent.name.toLowerCase().includes('icon')) {
            return true;
        }
        if (node.mainComponent.parent?.type === 'COMPONENT_SET') {
            if (node.mainComponent.parent.name.toLowerCase().includes('icon')) {
                return true;
            }
        }
    }
    return false;
}

function rgbaToHex(color: RGB | RGBA): string {
    const toHex = (c: number) => Math.round(c * 255).toString(16).padStart(2, '0');
    const alpha = 'a' in color ? color.a : 1;
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}${toHex(alpha)}`.toUpperCase();
}

async function translateNodeToDSL(node: SceneNode, indentLevel = 0): Promise<string> {
    const indent = "  ".repeat(indentLevel);
    const props: string[] = [];
    let type: string;
    let textContent = "";
    const isIcon = isIconNode(node);

    if (isIcon) {
        type = "K";
    } else if (node.type === "TEXT") {
        type = "T";
    } else if (node.type === "FRAME" || node.type === "COMPONENT" || node.type === "INSTANCE" || node.type === "GROUP") {
        if ('layoutMode' in node) {
            switch (node.layoutMode) {
                case "VERTICAL": type = "V"; break;
                case "HORIZONTAL": type = "H"; break;
                default: type = "F";
            }
        } else {
            type = "F";
        }
    } else {
        type = "K";
    }

    const name = `"${node.name}"`;

    let width: string, height: string;
    if (node.type === 'TEXT') {
        switch (node.textAutoResize) {
            case 'WIDTH_AND_HEIGHT': width = 'hug'; height = 'hug'; break;
            case 'HEIGHT': width = `${Math.round(node.width)}`; height = 'hug'; break;
            default: width = `${Math.round(node.width)}`; height = `${Math.round(node.height)}`;
        }
    } else {
        width = 'primaryAxisSizingMode' in node && node.primaryAxisSizingMode === 'AUTO' ? 'hug' : `${Math.round(node.width)}`;
        height = 'counterAxisSizingMode' in node && node.counterAxisSizingMode === 'AUTO' ? 'hug' : `${Math.round(node.height)}`;

        const parent = node.parent;
        if (parent && 'layoutMode' in parent && parent.layoutMode !== 'NONE' && 'layoutAlign' in node && 'layoutGrow' in node) {
            if (parent.layoutMode === 'VERTICAL') {
                if (node.layoutAlign === 'STRETCH') width = 'fill';
                if (node.layoutGrow === 1) height = 'fill';
            } else {
                if (node.layoutGrow === 1) width = 'fill';
                if (node.layoutAlign === 'STRETCH') height = 'fill';
            }
        }
    }


    if ("layoutMode" in node) {
        if (node.primaryAxisAlignItems !== 'MIN') {
            const justifyMap: Record<"CENTER" | "MAX" | "SPACE_BETWEEN", string> = { 'CENTER': 'c', 'MAX': 'e', 'SPACE_BETWEEN': 'b' };
            if(justifyMap[node.primaryAxisAlignItems as keyof typeof justifyMap]) props.push(`j:${justifyMap[node.primaryAxisAlignItems as keyof typeof justifyMap]}`);
        }
        if (node.counterAxisAlignItems !== 'MIN' && node.counterAxisAlignItems !== 'BASELINE') {
            const alignMap: Record<"CENTER" | "MAX", string> = { 'CENTER': 'c', 'MAX': 'e' };
            if(alignMap[node.counterAxisAlignItems as keyof typeof alignMap]) props.push(`a:${alignMap[node.counterAxisAlignItems as keyof typeof alignMap]}`);
        }
        if (node.itemSpacing > 0) props.push(`gap:${node.itemSpacing}`);
        if (node.paddingTop > 0 || node.paddingRight > 0 || node.paddingBottom > 0 || node.paddingLeft > 0) {
            props.push(`p:${node.paddingTop},${node.paddingRight},${node.paddingBottom},${node.paddingLeft}`);
        }
    }

    if ('fills' in node && Array.isArray(node.fills) && node.fills.length > 0) {
        const fill = node.fills.find(f => f.visible && f.type === 'SOLID');
        if (fill && fill.type === 'SOLID') props.push(`fill:${rgbaToHex(fill.color)}`);
    }

    if ('strokes' in node && node.strokes.length > 0 && 'strokeWeight' in node && typeof node.strokeWeight === 'number') {
        const stroke = node.strokes[0];
        if (stroke.type === 'SOLID' && stroke.visible) {
            props.push(`s:${rgbaToHex(stroke.color)}`);
            if (node.strokeWeight > 0) props.push(`sw:${node.strokeWeight.toFixed(2)}`);
        }
    }

    if ('cornerRadius' in node && typeof node.cornerRadius === 'number' && node.cornerRadius > 0) {
        props.push(`br:${Math.round(node.cornerRadius)}`);
    }

    if (node.type === "TEXT") {
        if (node.fontName !== figma.mixed) {
            await figma.loadFontAsync(node.fontName);
            if (node.fontName.family !== "Inter") props.push(`font:"${node.fontName.family}"`);
            const weightMap: { [key: string]: number } = { "Thin": 100, "ExtraLight": 200, "Light": 300, "Regular": 400, "Medium": 500, "SemiBold": 600, "Bold": 700, "ExtraBold": 800, "Black": 900 };
            const style = node.fontName.style.replace(' ', '');
            if (weightMap[style] && weightMap[style] !== 400) {
                props.push(`fw:${weightMap[style]}`);
            }
        }
        if (node.fontSize !== figma.mixed) props.push(`fs:${Math.round(node.fontSize)}`);
        textContent = ` "${node.characters.replace(/"/g, '\\"')}"`;
    }

    if (isIcon) {
        const iconName = node.name.toLowerCase().replace('icon', '').trim().replace(' ', '-');
        textContent = ` "${iconName}"`;
    }
    
    let dslLine = `${indent}${type} ${name} ${width} ${height}`;
    if (props.length > 0) dslLine += ` ${props.join(' ')}`;
    if (textContent) dslLine += `${textContent}`;
    if ("children" in node && !isIcon) {
        for (const child of node.children) {
            dslLine += "\n" + await translateNodeToDSL(child, indentLevel + 1);
        }
    }
    return dslLine;
}

function parseColor(color: string): RGBA {
  const hexMatch = color.match(/^#?([A-Fa-f0-9]{6})([A-Fa-f0-9]{2})?$/);
  if (hexMatch) {
    return {
      r: parseInt(hexMatch[1].slice(0, 2), 16) / 255,
      g: parseInt(hexMatch[1].slice(2, 4), 16) / 255,
      b: parseInt(hexMatch[1].slice(4, 6), 16) / 255,
      a: hexMatch[2] ? parseInt(hexMatch[2], 16) / 255 : 1,
    };
  }
  switch (color.toLowerCase()) {
    case "white": return { r: 1, g: 1, b: 1, a: 1 };
    case "black": return { r: 0, g: 0, b: 0, a: 1 };
    case "red": return { r: 1, g: 0, b: 0, a: 1 };
    default: return { r: 0.5, g: 0.5, b: 0.5, a: 1 };
  }
}

function parseUIInstructions(response: string): UIComponent[] {
  const components: UIComponent[] = [];
  const lines = response.split("\n").filter(line => line.trim());
  const stack: { level: number; parent: UIComponent[] }[] = [{ level: -1, parent: components }];

  for (const line of lines) {
    const indent = (line.match(/^\s*/)![0].length) / 2;
    const trimmedLine = line.trim();

    const mainPartMatch = trimmedLine.match(/^([VHFTSKI])\s+"([^"]+)"\s+(fill|hug|\d+)\s+(fill|hug|\d+)/);
    if (!mainPartMatch) continue;

    const [, type, name, widthStr, heightStr] = mainPartMatch;
    const restOfLine = trimmedLine.substring(mainPartMatch[0].length).trim();

    const component: UIComponent = {
      type: type as UIComponent['type'],
      name,
      width: widthStr === "fill" || widthStr === "hug" ? widthStr : parseInt(widthStr, 10),
      height: heightStr === "fill" || heightStr === "hug" ? heightStr : parseInt(heightStr, 10),
      children: [],
    };

    const tokens = restOfLine.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    for (const token of tokens) {
      const [key, ...valueParts] = token.split(':');
      const value = valueParts.join(':');

      if (token.startsWith('"') && token.endsWith('"')) {
          if (component.type === 'T') component.text = token.slice(1, -1);
          else if (component.type === 'K') component.iconType = token.slice(1, -1);
      } else switch (key) {
        case 'fill':
          if (value.startsWith("linear(")) {
            const gradientMatch = value.match(/linear\((\d+),(.+)\)/);
            if (gradientMatch) {
              const stopsParts = gradientMatch[2].split(',');
              component.fill = {
                type: "linear",
                angle: parseInt(gradientMatch[1], 10),
                stops: Array.from({ length: stopsParts.length / 2 }, (_, i) => ({
                  color: stopsParts[i * 2],
                  position: parseFloat(stopsParts[i * 2 + 1]) / 100,
                })),
              };
            }
          } else {
            component.fill = value;
          }
          break;
        case 'a': component.align = value === 's' ? 'start' : value === 'c' ? 'center' : 'end'; break;
        case 'j': component.justify = value === 's' ? 'start' : value === 'c' ? 'center' : value === 'e' ? 'end' : 'space-between'; break;
        case 'gap': component.gap = parseInt(value, 10); break;
        case 'p':
        case 'br':
        case 'sw':
          const values = value.split(',').map(Number);
          const propName = key === 'p' ? 'padding' : key === 'br' ? 'borderRadius' : 'strokeWidth';
          component[propName] = values.length === 1 ? values[0] : (values as [number, number, number, number]);
          break;
        case 's': component.stroke = value; break;
        case 'o': component.opacity = parseFloat(value); break;
        case 'bl': component.blur = parseInt(value, 10); break;
        case 'sh':
          const [offsetX, offsetY, blur, spread, color, opacity = 1] = value.split(',');
          component.shadow = { offsetX: +offsetX, offsetY: +offsetY, blur: +blur, spread: +spread, color, opacity: +opacity };
          break;
        case 'abs': component.position = { x: +value.split('/')[0], y: +value.split('/')[1] }; break;
        case 'clip': component.clip = true; break;
        case 'font': component.fontFamily = value.startsWith('"') && value.endsWith('"') ? value.slice(1, -1) : value; break;
        case 'fw': component.fontWeight = parseInt(value, 10); break;
        case 'fs': component.fontSize = parseInt(value, 10); break;
        case 'lh': component.lineHeight = value; break;
        case 'ls': component.letterSpacing = parseFloat(value); break;
      }
    }

    while (stack.length > 1 && indent <= stack[stack.length - 1].level) stack.pop();
    stack[stack.length - 1].parent.push(component);
    stack.push({ level: indent, parent: component.children });
  }
  return components;
}


function levenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array(bn + 1);
  for (let i = 0; i <= bn; ++i) matrix[i] = [i];
  const firstRow = [];
  for (let j = 0; j <= an; ++j) firstRow[j] = j;
  matrix[0] = firstRow;
  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[bn][an];
}

function findClosestIconName(name: string): string {
  if (LUCIDE_ICON_NAMES.includes(name)) {
    return name;
  }

  let bestMatch = name;
  let minDistance = Infinity;

  for (const iconName of LUCIDE_ICON_NAMES) {
    const distance = levenshteinDistance(name, iconName);
    if (distance < minDistance) {
      minDistance = distance;
      bestMatch = iconName;
    }
  }

  if (minDistance > name.length * 0.6) {
      console.warn(`Nie znaleziono dobrego dopasowania dla ikony "${name}". Używam oryginalnej nazwy, co może spowodować błąd.`);
      return name; 
  }

  console.log(`Automatyczna korekta nazwy ikony: "${name}" -> "${bestMatch}" (dystans: ${minDistance})`);
  return bestMatch;
}

async function generateDesign(components: UIComponent[]) {
  const nodes: SceneNode[] = [];

  async function renderComponent(component: UIComponent, parentNode?: FrameNode): Promise<SceneNode | null> {
    if (component.type === 'K') {
      if (!component.iconType) {
        console.warn('Pominięto ikonę bez nazwy (iconType).');
        return null;
      }
      const correctedIconName = findClosestIconName(component.iconType.toLowerCase());
      const iconUrl = `https://cdn.jsdelivr.net/npm/lucide-static/icons/${correctedIconName}.svg`;
      try {
        const response = await fetch(iconUrl);
        if (!response.ok) throw new Error(`Nie znaleziono ikony: ${correctedIconName}`);
        const svgContent = await response.text();
        const node = figma.createNodeFromSvg(svgContent);
        node.name = component.name || component.iconType;
        if (!node.name.toLowerCase().includes('icon')) node.name = `${node.name}Icon`;
        const width = typeof component.width === 'number' ? component.width : 24;
        const height = typeof component.height === 'number' ? component.height : 24;
        node.resize(width, height);
        if (component.fill && typeof component.fill === 'string') {
          const { r, g, b, a } = parseColor(component.fill);
          for (const child of node.children) {
            if (child.type === 'VECTOR') {
              child.fills = [];
              child.strokes = [{ type: 'SOLID', color: { r, g, b }, opacity: a }];
              child.strokeWeight = 1.67;
            }
          }
        }
        if (component.opacity !== undefined) node.opacity = component.opacity;
        if (component.position) {
          node.layoutPositioning = 'ABSOLUTE';
          node.x = component.position.x;
          node.y = component.position.y;
        }
        if (parentNode && parentNode.layoutMode !== 'NONE') {
          const isParentVertical = parentNode.layoutMode === 'VERTICAL';
          if (isParentVertical) {
            node.layoutAlign = component.width === 'fill' ? 'STRETCH' : 'INHERIT';
            node.layoutGrow = component.height === 'fill' ? 1 : 0;
          } else {
            node.layoutAlign = component.height === 'fill' ? 'STRETCH' : 'INHERIT';
            node.layoutGrow = component.width === 'fill' ? 1 : 0;
          }
        }
        return node;
      } catch (error: any) {
        console.error(`Błąd ładowania ikony: ${error.message}. Tworzę placeholder.`);
        const fallbackNode = figma.createFrame();
        fallbackNode.name = `(Błąd) ${component.name}`;
        const size = typeof component.width === 'number' ? component.width : 24;
        fallbackNode.resize(size, size);
        return fallbackNode;
      }
    }

    let node: FrameNode | TextNode;
    if (component.type === "T") {
      node = figma.createText();
    } else {
      node = figma.createFrame();
      if (component.type === "V" || component.type === "H") {
        node.layoutMode = component.type === "V" ? "VERTICAL" : "HORIZONTAL";
        if (component.type === "V") {
          node.primaryAxisSizingMode = component.height === 'hug' ? 'AUTO' : 'FIXED';
          node.counterAxisSizingMode = component.width === 'hug' ? 'AUTO' : 'FIXED';
        } else {
          node.primaryAxisSizingMode = component.width === 'hug' ? 'AUTO' : 'FIXED';
          node.counterAxisSizingMode = component.height === 'hug' ? 'AUTO' : 'FIXED';
        }
        node.itemSpacing = component.gap || 0;
        if (component.justify) node.primaryAxisAlignItems = component.justify === 'start' ? 'MIN' : component.justify === 'center' ? 'CENTER' : component.justify === 'end' ? 'MAX' : 'SPACE_BETWEEN';
        if (component.align) node.counterAxisAlignItems = component.align === 'start' ? 'MIN' : component.align === 'center' ? 'CENTER' : 'MAX';
      } else {
        node.layoutSizingHorizontal = component.width === 'hug' ? 'HUG' : 'FIXED';
        node.layoutSizingVertical = component.height === 'hug' ? 'HUG' : 'FIXED';
      }
    }

    node.name = component.name;

    const hasNumericWidth = typeof component.width === 'number';
    const hasNumericHeight = typeof component.height === 'number';

    console.log(`Name: ${node.name}, Type: ${node.type}, Width: ${component.width}, Height: ${component.height}`);
    console.log(`Has numeric width: ${hasNumericWidth}, Has numeric height: ${hasNumericHeight}`);

    if (hasNumericWidth || hasNumericHeight) {
      const currentWidth = hasNumericWidth ? (component.width as number) : node.width;
      const currentHeight = hasNumericHeight ? (component.height as number) : node.height;
      node.resize(currentWidth, currentHeight);
    }

    console.log(`Node resized to: ${node.width}x${node.height}`);

    if (parentNode && parentNode.layoutMode !== 'NONE') {
      const isParentVertical = parentNode.layoutMode === 'VERTICAL';
      if (isParentVertical) {
        if (component.width === 'fill') node.layoutAlign = 'STRETCH';
        if (component.height === 'fill') node.layoutGrow = 1;
      } else {
        if (component.height === 'fill') node.layoutAlign = 'STRETCH';
        if (component.width === 'fill') node.layoutGrow = 1;
      }
    }

    if (node.type === 'FRAME') {
      if (component.fill) {
        if (typeof component.fill === "string") {
          const { r, g, b, a } = parseColor(component.fill);
          node.fills = [{ type: "SOLID", color: { r, g, b }, opacity: a }];
        } else if (component.fill.type === "linear") {
          node.fills = [{
            type: "GRADIENT_LINEAR",
            gradientTransform: [[Math.cos(component.fill.angle * Math.PI / 180), Math.sin(component.fill.angle * Math.PI / 180), 0], [-Math.sin(component.fill.angle * Math.PI / 180), Math.cos(component.fill.angle * Math.PI / 180), 0]],
            gradientStops: component.fill.stops.map(stop => ({ color: parseColor(stop.color), position: stop.position })),
          }];
        }
      } else {
        node.fills = [];
      }

      if (component.stroke) {
        const { r, g, b, a } = parseColor(component.stroke);
        node.strokes = [{ type: 'SOLID', color: { r, g, b }, opacity: a }];
        if (typeof component.strokeWidth === 'number') node.strokeWeight = component.strokeWidth;
        else if (Array.isArray(component.strokeWidth)) {
          node.strokeTopWeight = component.strokeWidth[0];
          node.strokeRightWeight = component.strokeWidth[1];
          node.strokeBottomWeight = component.strokeWidth[2];
          node.strokeLeftWeight = component.strokeWidth[3];
        }
      }

      if (component.clip) node.clipsContent = true;
      if (typeof component.padding === 'number') node.paddingLeft = node.paddingRight = node.paddingTop = node.paddingBottom = component.padding;
      else if (Array.isArray(component.padding)) {
        node.paddingTop = component.padding[0];
        node.paddingRight = component.padding[1];
        node.paddingBottom = component.padding[2];
        node.paddingLeft = component.padding[3];
      }

      if (typeof component.borderRadius === 'number') node.cornerRadius = component.borderRadius;
      else if (Array.isArray(component.borderRadius)) {
        node.topLeftRadius = component.borderRadius[0];
        node.topRightRadius = component.borderRadius[1];
        node.bottomRightRadius = component.borderRadius[2];
        node.bottomLeftRadius = component.borderRadius[3];
      }
    }

    if (node.type === 'TEXT') {
      if (typeof component.fill === 'string') {
        const { r, g, b, a } = parseColor(component.fill);
        node.fills = [{ type: "SOLID", color: { r, g, b }, opacity: a }];
      }

      const fontNameValue = component.fontFamily || "Inter";
      const fontWeight = component.fontWeight || 400;
      const fontStyle = fontWeight >= 600 ? "Bold" : fontWeight >= 500 ? "Medium" : "Regular";

      await figma.loadFontAsync({ family: fontNameValue, style: fontStyle });
      node.fontName = { family: fontNameValue, style: fontStyle };
      
      node.characters = component.text || "";
      if (component.width === 'hug') {
          node.textAutoResize = 'WIDTH_AND_HEIGHT';
      } else if (typeof component.width === 'number' && component.width > 0) {
          if (typeof component.height === 'number' && component.height > 0) {
              node.textAutoResize = 'NONE';
              node.resize(component.width, component.height);
          } else {
              node.textAutoResize = 'HEIGHT';
              node.resize(component.width, node.height);
          }
      } else {
          node.textAutoResize = 'HEIGHT';
      }

      if (component.fontSize) node.fontSize = component.fontSize;
      if (component.letterSpacing) node.letterSpacing = { value: component.letterSpacing, unit: "PIXELS" };
      if (component.lineHeight) node.lineHeight = { value: parseFloat(component.lineHeight), unit: "PERCENT" };
    }

    const effects: Effect[] = [];
    if (component.blur) effects.push({ type: 'LAYER_BLUR', blurType: 'NORMAL', radius: component.blur, visible: true });
    if (component.shadow) effects.push({
      type: 'DROP_SHADOW',
      color: { ...parseColor(component.shadow.color), a: component.shadow.opacity },
      offset: { x: component.shadow.offsetX, y: component.shadow.offsetY },
      radius: component.shadow.blur,
      spread: component.shadow.spread,
      blendMode: 'NORMAL',
      visible: true
    });
    if (effects.length > 0) node.effects = effects;

    if (node.type === 'FRAME' && Array.isArray(component.children)) {
      for (const childComponent of component.children) {
        const childNode = await renderComponent(childComponent, node);
        if (childNode) node.appendChild(childNode);
      }
    }
    return node;
  }

  let yPos = 0;
  for (const component of components) {
    const node = await renderComponent(component);
    if (node) {
      figma.currentPage.appendChild(node);
      nodes.push(node);
      if (!component.position) {
        node.y = yPos;
        yPos += node.height + 20;
      }
    }
  }

  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);
}
