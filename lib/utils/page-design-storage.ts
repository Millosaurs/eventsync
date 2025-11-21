import { PageDesign } from "@/lib/types/page-builder";

export class PageDesignStorage {
  private static STORAGE_KEY = "page-designs";

  /**
   * Save a page design to localStorage
   */
  static saveDesign(eventId: string, design: PageDesign): void {
    try {
      const designs = this.getAllDesigns();
      designs[eventId] = design;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(designs));
    } catch (error) {
      console.error("Failed to save design:", error);
      throw new Error("Failed to save design");
    }
  }

  /**
   * Load a page design from localStorage
   */
  static loadDesign(eventId: string): PageDesign | null {
    try {
      const designs = this.getAllDesigns();
      return designs[eventId] || null;
    } catch (error) {
      console.error("Failed to load design:", error);
      return null;
    }
  }

  /**
   * Delete a page design from localStorage
   */
  static deleteDesign(eventId: string): void {
    try {
      const designs = this.getAllDesigns();
      delete designs[eventId];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(designs));
    } catch (error) {
      console.error("Failed to delete design:", error);
      throw new Error("Failed to delete design");
    }
  }

  /**
   * Get all page designs from localStorage
   */
  static getAllDesigns(): Record<string, PageDesign> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error("Failed to get designs:", error);
      return {};
    }
  }

  /**
   * Export a design as a JSON file
   */
  static exportDesignAsFile(eventId: string, design: PageDesign): void {
    try {
      const dataStr = JSON.stringify(design, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `page-design-${eventId}-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export design:", error);
      throw new Error("Failed to export design");
    }
  }

  /**
   * Import a design from a JSON file
   */
  static async importDesignFromFile(file: File): Promise<PageDesign> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const design: PageDesign = JSON.parse(e.target?.result as string);

          // Validate design structure
          if (!design.version || !Array.isArray(design.blocks)) {
            throw new Error("Invalid design file structure");
          }

          resolve(design);
        } catch (error) {
          reject(new Error("Invalid design file"));
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsText(file);
    });
  }

  /**
   * Clear all designs from localStorage
   */
  static clearAllDesigns(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear designs:", error);
      throw new Error("Failed to clear designs");
    }
  }
}
