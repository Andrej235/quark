using System.Text.Json;
using Quark.Models;

namespace Quark.Utilities;

public static class DefaultProspectLayout
{
    private const string JSON_STRUCTURE = """
        {
            "id": "root",
            "type": "column",
            "content": 
            [
                {
                    "id": "row-1",
                    "type": "row",
                    "content": 
                    [
                        {
                            "flex": 2,
                            "slot": {
                                "id": "company-name",
                                "type": "text-field",
                                "name": "Company Name",
                                "placeholder": "Enter company name",
                                "validateFormat": "letters",
                                "formatRegex": "{\"source\":\"^[a-zA-Z]*$\",\"flags\":\"\"}",
                                "validateFormatError": "Must only contain letters"
                            }
                        },
                        {
                            "flex": 1,
                            "slot": {
                                "id": "logo",
                                "type": "image-field",
                                "name": "Logo",
                                "compressionQuality": 0.5,
                                "inputTypes": [
                                    "png",
                                    "jpg",
                                    "webp",
                                    "gif",
                                    "svg"
                                ],
                                "savedAs": "webp"
                            }
                        }
                    ]
                },
                {
                    "id": "description",
                    "type": "text-field",
                    "name": "Description",
                    "placeholder": "Enter a brief description",
                    "validateFormat": "none",
                    "formatRegex": "{\"source\":\"^\",\"flags\":\"\"}",
                    "validateFormatError": ""
                },
                {
                    "id": "contact-info",
                    "type": "card",
                    "header":
                    {
                        "id": "contact-info-header",
                        "type": "card-header",
                        "title": "Contact Information",
                        "description": "Details about the contact person"
                    },
                    "content": 
                    {
                        "id": "contact-info-content",
                        "type": "column",
                        "content": 
                        [
                            {
                                "id": "contact-name",
                                "type": "text-field",
                                "name": "Contact Name",
                                "placeholder": "Enter contact name",
                                "validateFormat": "letters",
                                "formatRegex": "{\"source\":\"^[a-zA-Z]*$\",\"flags\":\"\"}",
                                "validateFormatError": "Must only contain letters"
                            },
                            {
                                "id": "email",
                                "type": "text-field",
                                "name": "Email",
                                "placeholder": "Enter email address",
                                "validateFormat": "email",
                                "formatRegex": "{\"source\":\"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}$\",\"flags\":\"\"}",
                                "validateFormatError": "Invalid email address"
                            },
                            {
                                "id": "phone",
                                "type": "text-field",
                                "name": "Phone",
                                "placeholder": "Enter phone number",
                                "validateFormat": "phone",
                                "formatRegex": "{\"source\":\"^(?:\\\\+?\\\\d{1,3}[-.\\\\s]?)?\\\\(?\\\\d{3}\\\\)?[-.\\\\s]?\\\\d{3}[-.\\\\s]?\\\\d{4}$\",\"flags\":\"\"}",
                                "validateFormatError": "Invalid phone number"
                            }
                        ]
                    },
                    "footer":
                    {
                        "id": "contact-info-footer",
                        "type": "card-footer",
                        "buttons": 
                        [
                            {
                                "id": "save-button",
                                "type": "button",
                                "label": "Save",
                                "variant": "default",
                                "size": "default"
                            }
                        ]
                    }
                }
            ]
        }
        """;

    public static ProspectLayout GetDefaultLayout()
    {
        return new ProspectLayout() { JsonStructure = JsonDocument.Parse(JSON_STRUCTURE) };
    }
}
