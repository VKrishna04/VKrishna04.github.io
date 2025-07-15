/*
 * Copyright 2025 Krishna GSVV
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
	EnvelopeIcon,
	PhoneIcon,
	MapPinIcon,
	PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import {
	FaGithub,
	FaLinkedin,
	FaTwitter,
	FaInstagram,
	FaDiscord,
	FaYoutube,
	FaTwitch,
	FaTiktok,
	FaMedium,
	FaDev,
	FaStackOverflow,
	FaDribbble,
	FaBehance,
	FaCodepen,
} from "react-icons/fa";

const Contact = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [settings, setSettings] = useState({});

	useEffect(() => {
		// Fetch settings for contact information
		fetch("/settings.json")
			.then((response) => response.json())
			.then((data) => setSettings(data))
			.catch((error) => console.warn("Could not fetch settings:", error));
	}, []);

	// Icon mapping for social links
	const iconMap = {
		FaGithub,
		FaLinkedin,
		FaTwitter,
		FaInstagram,
		FaDiscord,
		FaYoutube,
		FaTwitch,
		FaTiktok,
		FaMedium,
		FaDev,
		FaStackOverflow,
		FaDribbble,
		FaBehance,
		FaCodepen,
	};

	const getIconComponent = (iconName) => {
		return iconMap[iconName];
	};

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate form submission
		setTimeout(() => {
			setIsSubmitting(false);
			alert("Thank you for your message! I'll get back to you soon.");
			setFormData({ name: "", email: "", subject: "", message: "" });
		}, 2000);
	};

	const contactInfo = [
		{
			icon: EnvelopeIcon,
			label: "Email",
			value: settings.social?.contact?.email || "contact@vkrishna04.dev",
			href: `mailto:${
				settings.social?.contact?.email || "contact@vkrishna04.dev"
			}`,
			show: true, // Always show email
		},
		{
			icon: PhoneIcon,
			label: "Phone",
			value: settings.social?.contact?.phone || "+1 (555) 123-4567",
			href: `tel:${settings.social?.contact?.phone || "+15551234567"}`,
			show:
				settings.social?.contact?.phone &&
				settings.social.contact.phone.trim() !== "",
		},
		{
			icon: MapPinIcon,
			label: "Location",
			value: settings.social?.contact?.location || "San Francisco, CA",
			href: "#",
			show:
				settings.social?.contact?.location &&
				settings.social.contact.location.trim() !== "",
		},
	].filter((item) => item.show);

	const getSocialLinks = () => {
		if (!settings.social?.platforms) return [];

		return settings.social.platforms.filter(
			(platform) =>
				platform.enabled &&
				platform.url &&
				platform.url.trim() !== "" &&
				platform.showInContact
		);
	};

	const socialLinks = getSocialLinks();

	const fadeInUp = {
		initial: { opacity: 0, y: 60 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.6 },
	};

	const staggerContainer = {
		animate: {
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	return (
		<div className="min-h-screen py-20 px-4">
			<div className="max-w-6xl mx-auto">
				<motion.div
					variants={staggerContainer}
					initial="initial"
					animate="animate"
				>
					{/* Header */}
					<motion.div className="text-center mb-16" variants={fadeInUp}>
						<h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
							Get In Touch
						</h1>
						<p className="text-xl text-gray-300">
							Let's discuss your next project or just say hello!
						</p>
					</motion.div>

					<div className="grid lg:grid-cols-2 gap-12">
						{/* Contact Information */}
						<motion.div variants={fadeInUp}>
							<h2 className="text-2xl font-bold text-white mb-8">
								Contact Information
							</h2>

							<div className="space-y-6 mb-8">
								{contactInfo.map((info, index) => (
									<motion.div
										key={index}
										className="flex items-center space-x-4 p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
										whileHover={{ scale: 1.02 }}
									>
										<div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
											<info.icon className="w-6 h-6 text-purple-400" />
										</div>
										<div>
											<p className="text-gray-400 text-sm">{info.label}</p>
											{info.href !== "#" ? (
												<a
													href={info.href}
													className="text-white font-semibold hover:text-purple-400 transition-colors"
												>
													{info.value}
												</a>
											) : (
												<p className="text-white font-semibold">{info.value}</p>
											)}
										</div>
									</motion.div>
								))}
							</div>

							{/* Social Links */}
							<div>
								<h3 className="text-xl font-bold text-white mb-4">Follow Me</h3>
								<div className="flex space-x-4">
									{socialLinks.map((social, index) => {
										const IconComponent = getIconComponent(social.icon);
										return IconComponent ? (
											<motion.a
												key={index}
												href={social.url}
												target="_blank"
												rel="noopener noreferrer"
												className={`w-12 h-12 bg-gray-800/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-700/50 transition-all duration-300 ${
													social.color || "text-gray-400"
												} ${social.hoverColor || "hover:text-purple-400"}`}
												whileHover={{ scale: 1.1, y: -5 }}
												whileTap={{ scale: 0.9 }}
												aria-label={social.label}
											>
												<IconComponent className="w-5 h-5" />
											</motion.a>
										) : null;
									})}
								</div>
							</div>
						</motion.div>

						{/* Contact Form */}
						<motion.div variants={fadeInUp}>
							<h2 className="text-2xl font-bold text-white mb-8">
								Send Message
							</h2>

							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="grid md:grid-cols-2 gap-6">
									<div>
										<label
											htmlFor="name"
											className="block text-gray-300 font-semibold mb-2"
										>
											Name *
										</label>
										<input
											type="text"
											id="name"
											name="name"
											value={formData.name}
											onChange={handleChange}
											required
											className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
											placeholder="Your Name"
										/>
									</div>

									<div>
										<label
											htmlFor="email"
											className="block text-gray-300 font-semibold mb-2"
										>
											Email *
										</label>
										<input
											type="email"
											id="email"
											name="email"
											value={formData.email}
											onChange={handleChange}
											required
											className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
											placeholder="your.email@example.com"
										/>
									</div>
								</div>

								<div>
									<label
										htmlFor="subject"
										className="block text-gray-300 font-semibold mb-2"
									>
										Subject *
									</label>
									<input
										type="text"
										id="subject"
										name="subject"
										value={formData.subject}
										onChange={handleChange}
										required
										className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
										placeholder="What's this about?"
									/>
								</div>

								<div>
									<label
										htmlFor="message"
										className="block text-gray-300 font-semibold mb-2"
									>
										Message *
									</label>
									<textarea
										id="message"
										name="message"
										rows={6}
										value={formData.message}
										onChange={handleChange}
										required
										className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors resize-none"
										placeholder="Your message here..."
									/>
								</div>

								<motion.button
									type="submit"
									disabled={isSubmitting}
									className={`w-full inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 ${
										isSubmitting ? "opacity-70 cursor-not-allowed" : ""
									}`}
									whileHover={!isSubmitting ? { scale: 1.02 } : {}}
									whileTap={!isSubmitting ? { scale: 0.98 } : {}}
								>
									{isSubmitting ? (
										<>
											<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
											Sending...
										</>
									) : (
										<>
											Send Message
											<PaperAirplaneIcon className="ml-2 w-5 h-5" />
										</>
									)}
								</motion.button>
							</form>
						</motion.div>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default Contact;
