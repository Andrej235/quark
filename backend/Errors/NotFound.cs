using FluentResults;

namespace Quark.Errors;

public class NotFound(string message) : Error(message) { }
