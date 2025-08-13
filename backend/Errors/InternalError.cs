using FluentResults;

namespace Quark.Errors;

public class InternalError(string message) : Error(message) { }
