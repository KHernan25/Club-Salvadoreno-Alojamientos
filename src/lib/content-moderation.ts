// Content moderation utilities for reviews
// This includes basic profanity filtering, spam detection, and content validation

// Basic Spanish profanity and inappropriate content list
const INAPPROPRIATE_WORDS = [
  // Add Spanish profanity words here
  "idiota",
  "estúpido",
  "maldito",
  "basura",
  "porquería",
  "asqueroso",
  "sucio",
  "horrible",
  "pesimo",
  "terrible",
  // Common spam indicators
  "spam",
  "promoción",
  "descuento",
  "gratis",
  "oferta",
  "click",
  "enlace",
  "link",
  "contacto",
  "whatsapp",
  "telegram",
  "email",
  "@",
  "www",
  "http",
  "https",
  // Inappropriate personal information
  "teléfono",
  "celular",
  "número",
  "dirección",
  "ubicación",
];

// Spam patterns
const SPAM_PATTERNS = [
  /\b\d{3,4}[-\s]?\d{3,4}[-\s]?\d{4}\b/, // Phone numbers
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email addresses
  /\bwww\.[^\s]+\b/, // URLs
  /\bhttp[s]?:\/\/[^\s]+\b/, // URLs
  /\b(whatsapp|telegram|facebook|instagram)\b/i, // Social media mentions
  /(.)\1{4,}/, // Repeated characters (aaaaa, 11111)
  /\b(GRATIS|OFERTA|PROMOCIÓN|DESCUENTO)\b/gi, // Common spam words in caps
];

// Excessive punctuation or caps
const EXCESSIVE_PATTERNS = [
  /[!]{3,}/, // Too many exclamation marks
  /[?]{3,}/, // Too many question marks
  /[A-Z]{10,}/, // Too many consecutive capitals
  /(.{1,3})\1{5,}/, // Repetitive patterns
];

interface ModerationResult {
  isAppropriate: boolean;
  confidence: number; // 0-1, how confident we are in the assessment
  issues: string[];
  suggestions?: string[];
  autoApprove: boolean;
  requiresManualReview: boolean;
}

interface ContentToModerate {
  title: string;
  comment: string;
  pros?: string[];
  cons?: string[];
}

export class ContentModerator {
  private static instance: ContentModerator;

  static getInstance(): ContentModerator {
    if (!ContentModerator.instance) {
      ContentModerator.instance = new ContentModerator();
    }
    return ContentModerator.instance;
  }

  /**
   * Main moderation function that analyzes content
   */
  moderateContent(content: ContentToModerate): ModerationResult {
    const issues: string[] = [];
    let confidence = 1.0;
    let autoApprove = true;
    let requiresManualReview = false;

    // Combine all text content
    const allText = [
      content.title,
      content.comment,
      ...(content.pros || []),
      ...(content.cons || []),
    ].join(" ");

    // Check for inappropriate words
    const profanityCheck = this.checkProfanity(allText);
    if (!profanityCheck.isClean) {
      issues.push("Contiene lenguaje inapropiado");
      confidence -= 0.3;
      autoApprove = false;
      requiresManualReview = true;
    }

    // Check for spam patterns
    const spamCheck = this.checkSpam(allText);
    if (spamCheck.isSpam) {
      issues.push("Posible contenido de spam");
      confidence -= 0.4;
      autoApprove = false;
      requiresManualReview = true;
    }

    // Check content quality
    const qualityCheck = this.checkContentQuality(content);
    if (!qualityCheck.isGoodQuality) {
      issues.push(...qualityCheck.issues);
      confidence -= 0.2;
      if (qualityCheck.issues.length > 2) {
        requiresManualReview = true;
        autoApprove = false;
      }
    }

    // Check for excessive patterns
    const excessiveCheck = this.checkExcessivePatterns(allText);
    if (!excessiveCheck.isAppropriate) {
      issues.push("Uso excesivo de mayúsculas o signos de puntuación");
      confidence -= 0.1;
    }

    // Check length and detail
    const lengthCheck = this.checkContentLength(content);
    if (!lengthCheck.isAdequate) {
      issues.push(...lengthCheck.issues);
      confidence -= 0.1;
    }

    // Final decision logic
    const isAppropriate = issues.length === 0 || confidence > 0.7;

    // Auto-approve if confidence is high and no serious issues
    if (confidence > 0.8 && !requiresManualReview) {
      autoApprove = true;
    } else if (confidence < 0.5 || issues.length > 3) {
      autoApprove = false;
      requiresManualReview = true;
    }

    return {
      isAppropriate,
      confidence: Math.max(0, confidence),
      issues,
      suggestions: this.generateSuggestions(issues),
      autoApprove,
      requiresManualReview,
    };
  }

  /**
   * Check for profanity and inappropriate language
   */
  private checkProfanity(text: string): { isClean: boolean; words: string[] } {
    const lowercaseText = text.toLowerCase();
    const foundWords: string[] = [];

    for (const word of INAPPROPRIATE_WORDS) {
      if (lowercaseText.includes(word.toLowerCase())) {
        foundWords.push(word);
      }
    }

    return {
      isClean: foundWords.length === 0,
      words: foundWords,
    };
  }

  /**
   * Check for spam patterns
   */
  private checkSpam(text: string): { isSpam: boolean; patterns: string[] } {
    const foundPatterns: string[] = [];

    for (const pattern of SPAM_PATTERNS) {
      if (pattern.test(text)) {
        foundPatterns.push(pattern.toString());
      }
    }

    // Additional heuristics
    const words = text.split(/\s+/);
    const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
    const repetitionRatio = 1 - uniqueWords.size / words.length;

    if (repetitionRatio > 0.7 && words.length > 10) {
      foundPatterns.push("high_repetition");
    }

    return {
      isSpam: foundPatterns.length > 0,
      patterns: foundPatterns,
    };
  }

  /**
   * Check overall content quality
   */
  private checkContentQuality(content: ContentToModerate): {
    isGoodQuality: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    // Check if comment is just repetitive characters
    if (/^(.)\1+$/.test(content.comment.trim())) {
      issues.push("Comentario no constructivo");
    }

    // Check if title and comment are too similar
    const titleWords = content.title.toLowerCase().split(/\s+/);
    const commentWords = content.comment.toLowerCase().split(/\s+/);
    const similarity = this.calculateSimilarity(titleWords, commentWords);

    if (similarity > 0.8) {
      issues.push("Título y comentario son muy similares");
    }

    // Check for generic/template-like content
    const genericPhrases = [
      "muy bien",
      "está bien",
      "no está mal",
      "está ok",
      "todo bien",
      "recomendado",
    ];

    const isGeneric = genericPhrases.some((phrase) =>
      content.comment.toLowerCase().includes(phrase),
    );

    if (isGeneric && content.comment.length < 50) {
      issues.push("Comentario parece muy genérico");
    }

    return {
      isGoodQuality: issues.length === 0,
      issues,
    };
  }

  /**
   * Check for excessive patterns
   */
  private checkExcessivePatterns(text: string): {
    isAppropriate: boolean;
    patterns: string[];
  } {
    const foundPatterns: string[] = [];

    for (const pattern of EXCESSIVE_PATTERNS) {
      if (pattern.test(text)) {
        foundPatterns.push(pattern.toString());
      }
    }

    return {
      isAppropriate: foundPatterns.length === 0,
      patterns: foundPatterns,
    };
  }

  /**
   * Check content length adequacy
   */
  private checkContentLength(content: ContentToModerate): {
    isAdequate: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    if (content.title.length < 5) {
      issues.push("Título muy corto");
    }

    if (content.comment.length < 20) {
      issues.push("Comentario muy corto");
    }

    if (content.comment.length > 2000) {
      issues.push("Comentario excesivamente largo");
    }

    // Check word count
    const wordCount = content.comment.split(/\s+/).length;
    if (wordCount < 5) {
      issues.push("Comentario tiene muy pocas palabras");
    }

    return {
      isAdequate: issues.length === 0,
      issues,
    };
  }

  /**
   * Calculate text similarity (Jaccard similarity)
   */
  private calculateSimilarity(words1: string[], words2: string[]): number {
    const set1 = new Set(words1);
    const set2 = new Set(words2);

    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  }

  /**
   * Generate suggestions for improvement
   */
  private generateSuggestions(issues: string[]): string[] {
    const suggestions: string[] = [];

    if (issues.includes("Contiene lenguaje inapropiado")) {
      suggestions.push(
        "Usa un lenguaje más respetuoso y constructivo en tu reseña",
      );
    }

    if (issues.includes("Posible contenido de spam")) {
      suggestions.push(
        "Evita incluir información de contacto o enlaces en tu reseña",
      );
    }

    if (issues.includes("Comentario muy corto")) {
      suggestions.push(
        "Proporciona más detalles sobre tu experiencia para ayudar a otros huéspedes",
      );
    }

    if (issues.includes("Comentario parece muy genérico")) {
      suggestions.push(
        "Comparte aspectos específicos de tu estadía que fueron memorables",
      );
    }

    if (issues.includes("Uso excesivo de mayúsculas o signos de puntuación")) {
      suggestions.push(
        "Usa mayúsculas y signos de puntuación de manera moderada",
      );
    }

    return suggestions;
  }

  /**
   * Quick check if content needs human review
   */
  needsHumanReview(content: ContentToModerate): boolean {
    const result = this.moderateContent(content);
    return result.requiresManualReview || !result.autoApprove;
  }

  /**
   * Get moderation status for a review
   */
  getModerationStatus(
    content: ContentToModerate,
  ): "approved" | "pending" | "rejected" {
    const result = this.moderateContent(content);

    if (result.autoApprove && result.isAppropriate) {
      return "approved";
    } else if (result.requiresManualReview || !result.isAppropriate) {
      return result.confidence < 0.3 ? "rejected" : "pending";
    } else {
      return "pending";
    }
  }
}

// Export singleton instance
export const contentModerator = ContentModerator.getInstance();

// Helper function for easy usage
export function moderateReviewContent(content: ContentToModerate) {
  return contentModerator.moderateContent(content);
}

export function getReviewModerationStatus(content: ContentToModerate) {
  return contentModerator.getModerationStatus(content);
}
