package com.expensemanagement.Services;

import org.springframework.stereotype.Component;

/**
 * Rule-based category resolver for auto-categorization (Feature 5).
 * Maps keywords in expense title/description to predefined categories.
 * Call resolve() before saving an expense to auto-fill the category.
 */
@Component
public class CategoryResolver {

    private static final java.util.Map<String[], String> KEYWORD_MAP;

    static {
        KEYWORD_MAP = new java.util.LinkedHashMap<>();
        KEYWORD_MAP.put(new String[] { "uber", "ola", "taxi", "cab", "flight", "train", "bus", "metro",
                "rapido", "auto", "airfare", "airline" }, "Travel");
        KEYWORD_MAP.put(new String[] { "hotel", "lodge", "inn", "stay", "accommodation", "airbnb",
                "hostel", "resort" }, "Accommodation");
        KEYWORD_MAP.put(new String[] { "food", "restaurant", "lunch", "dinner", "breakfast", "swiggy",
                "zomato", "dominos", "pizza", "burger", "cafe", "coffee", "snack",
                "canteen", "meal" }, "Meals");
        KEYWORD_MAP.put(new String[] { "amazon", "flipkart", "office", "stationery", "supplies",
                "printer", "chair", "desk", "monitor", "keyboard", "mouse",
                "notebook", "pen", "laptop" }, "Office Supplies");
        KEYWORD_MAP.put(new String[] { "medical", "medicine", "hospital", "pharmacy", "clinic",
                "doctor", "health" }, "Medical");
        KEYWORD_MAP.put(new String[] { "internet", "broadband", "wifi", "phone", "mobile", "bill",
                "electricity", "utility" }, "Utilities");
        KEYWORD_MAP.put(new String[] { "training", "course", "seminar", "conference", "workshop",
                "certification", "book", "subscription" }, "Training & Development");
    }

    /**
     * Resolves a category from the expense title and description.
     *
     * @param title       The expense title
     * @param description The expense description
     * @return Matched category name, or "Other" if no keyword matches
     */
    public String resolve(String title, String description) {
        String combined = ((title == null ? "" : title) + " " +
                (description == null ? "" : description)).toLowerCase();

        for (java.util.Map.Entry<String[], String> entry : KEYWORD_MAP.entrySet()) {
            for (String keyword : entry.getKey()) {
                if (combined.contains(keyword)) {
                    return entry.getValue();
                }
            }
        }
        return "Other";
    }
}
