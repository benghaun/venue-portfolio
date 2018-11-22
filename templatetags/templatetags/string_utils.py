from django import template

register = template.Library()


@register.filter
def spaces(s):
    """adds spaces between each character in a string"""
    output = ""
    for char in s:
        output += char + " "
    return output[:-1]